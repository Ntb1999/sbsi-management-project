# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mục đích repo

Monorepo dùng chung cho các dự án nội bộ của team SBSI. Phần lớn thành viên không tự viết code — họ "vibecode": mô tả yêu cầu bằng lời cho Claude Code, Claude viết/chỉnh code thay họ. Vì vậy sự nhất quán về convention quan trọng hơn bình thường: mỗi app mới phải theo đúng stack/cấu trúc chuẩn dưới đây, để bất kỳ ai (kể cả không biết code) cũng có thể nhờ Claude tiếp tục phát triển app đó mà không cần hiểu kiến trúc từ đầu.

## Commands (root)

```bash
pnpm install         # cài dependency cho toàn bộ workspace
pnpm dev             # turbo run dev — chạy dev server của mọi app
pnpm build           # turbo run build
pnpm lint            # turbo run lint
```

Chạy riêng 1 app: `pnpm --filter <tên-app> dev|build|start`.

## Stack chuẩn cho app mới

- **Next.js (App Router, TypeScript)** — mặc định cho mọi app mới, trừ khi có lý do rõ ràng để khác.
- **Turborepo + pnpm workspaces** (đã setup sẵn ở root, không cần đụng vào trừ khi thêm app/package mới).
- Deploy ngoài Cloudflare Pages (vd Vercel) — vì vậy nếu app cần lưu trữ dùng chung thì qua Cloudflare KV **bằng REST API** (package `packages/cloudflare-kv`), KHÔNG dùng KV binding trực tiếp (binding chỉ chạy được khi code chạy trên chính Cloudflare Workers runtime, không chạy được trên Vercel/Node bình thường).

## Tạo app mới

Gõ `/new-app <tên-app>` (Claude sẽ hỏi thêm nếu thiếu thông tin). Xem chi tiết Claude cần làm gì ở `.claude/commands/new-app.md`.

**Quan trọng:** đừng lấy `apps/quan-tri-du-an-core` làm mẫu để copy — app đó có phần `src/legacy/` (chuyển đổi HTML tĩnh cũ sang Next.js) chỉ đặc thù cho việc fork app đó từ 1 site tĩnh có sẵn, KHÔNG phải pattern chuẩn cho app mới tinh. App mới luôn bắt đầu từ 1 Next.js app trơn theo `/new-app`.

## Cấu trúc

- `apps/<tên-app>/` — mỗi dự án là 1 app riêng biệt, có `CLAUDE.md` riêng ghi context cụ thể của app đó (mô tả dự án, quyết định kiến trúc riêng, env var cần thiết, v.v.). Khi làm việc trong 1 app, luôn đọc `CLAUDE.md` của app đó trước.
- `packages/<tên-package>/` — code dùng chung giữa nhiều app. Hiện có `@sbsi/cloudflare-kv` (client gọi Cloudflare KV qua REST API — `kvGet`/`kvPut`). Nếu 1 nhu cầu dùng chung xuất hiện ở ≥2 app, cân nhắc tách thành package mới ở đây thay vì copy code giữa các app.

## Danh sách app hiện có

| App | Mô tả ngắn | Chi tiết |
|---|---|---|
| `quan-tri-du-an-core` | Portal quản trị UAT cho dự án Core FSS (theo dõi test case, đồng bộ Jira) | `apps/quan-tri-du-an-core/CLAUDE.md` |

(Cập nhật bảng này — hoặc để `/new-app` tự cập nhật — mỗi khi thêm app mới, để phần "Mục đích repo" ở trên luôn hữu ích cho việc điều hướng.)

## Hệ thống hướng dẫn Claude (agentic setup)

- `.claude/rules/` — các quy tắc ngắn, luôn áp dụng: `env-secrets.md` (secrets/credentials), `git-workflow.md` (bao gồm quy tắc worktree — xem dưới), `claude-code-conventions.md`, `knowledge-base-maintenance.md` (chủ động cập nhật `apps/<app>/CLAUDE.md` sau mỗi task có ý nghĩa — xem dưới). Đọc khi bắt đầu bất kỳ task code nào.
- `.claude/hooks/` — guardrail tự động, chặn cứng chứ không chỉ nhắc: chặn lệnh git/rm/terraform phá hoại, chặn đọc `.env` qua shell, chặn ghi secret/private key vào file KHÔNG được gitignore, chặn empty catch block / silent fallback trong code, nhắc chạy build/lint trước khi commit, **chặn sửa code trực tiếp trên `main`/`master`** (trừ `CLAUDE.md`/`README.md`).
- `.claude/agents/` — subagent dùng chung: `coder` (agent implement 1 task, tự chạy verification), `pr-reviewer` (review thay đổi, ưu tiên đúng-sai + bảo mật + tuân thủ rules).
- `.claude/skills/` — quy trình cho việc lặp lại: `debugging`.
- `.claude/commands/new-app.md` — quy trình tạo app mới (`/new-app`), dùng mẫu `docs/templates/subproject-CLAUDE-template.md` để viết CLAUDE.md cho app mới.

**Quy tắc worktree:** mọi thay đổi code (không tính sửa `CLAUDE.md`/`README.md`) phải làm trong 1 worktree/branch riêng, không sửa trực tiếp trên `main`. Trước khi sửa code, Claude phải gọi tool `EnterWorktree` (tạo worktree cô lập dưới `.claude/worktrees/`) — có hook chặn cứng (`worktree-edit-guard.sh`) phòng khi quên. Xong việc, hỏi người dùng có muốn merge vào `main` không, không tự merge.

**Quy tắc duy trì knowledge base:** sau mỗi task có ý nghĩa trên 1 app, Claude tự cập nhật `apps/<app>/CLAUDE.md` — KHÔNG đợi người dùng yêu cầu. Mục đích: người dùng không phải giải thích lại bối cảnh từ đầu ở session sau, và Claude (kể cả phiên/thành viên khác) có thể tiếp tục đúng chỗ đang dang dở. Có hook nhắc (`knowledge-base-reminder.sh`, không chặn) khi kết thúc session mà `apps/` có thay đổi chưa commit nhưng CLAUDE.md thì không.

Các file trên được rút gọn/tổng quát hoá từ `AI-template` (tham khảo tại `C:\Users\dangk\Documents\sbsi\AI-template`) — phần nào không hợp với team này (TDD ép buộc khi chưa có test, đồng bộ 2 chiều với Codex) đã bỏ qua, có thể thêm lại sau nếu cần.
