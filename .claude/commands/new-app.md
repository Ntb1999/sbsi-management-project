---
description: Scaffold a new Next.js app in this monorepo following team conventions
argument-hint: <ten-app-kebab-case> [mo-ta-ngan-gon]
---

Bạn đang giúp một thành viên team (có thể không biết code) tạo 1 app mới trong monorepo này. Làm theo đúng thứ tự bên dưới, đừng bỏ bước, và giải thích bằng lời đơn giản ở mỗi bước quan trọng — người dùng không đọc được code.

## 0. Xác định tên & mục đích app

Args nhận được: "$ARGUMENTS"

- Nếu chưa có tên app: hỏi tên app, chuẩn hoá về kebab-case (vd "Theo Doi Luong" → `theo-doi-luong`). Kiểm tra `apps/<tên>` chưa tồn tại.
- Nếu chưa rõ app này làm gì: hỏi 1-2 câu ngắn (mục đích chính là gì, ai dùng) — đủ để viết CLAUDE.md có ích, không cần hỏi kỹ như phỏng vấn.
- Hỏi (dùng AskUserQuestion nếu cần): app này có cần lưu trữ dữ liệu dùng chung (Cloudflare KV) không? Có cần gọi hệ thống nội bộ công ty nào chỉ truy cập được từ mạng công ty/VPN không (giống `projects.fss.com.vn` bên `quan-tri-du-an-core`) — nếu có, cảnh báo trước: mọi route API chạy trên server deploy (Vercel...) sẽ KHÔNG gọi tới được hệ thống đó, phải có workflow đồng bộ thủ công/định kỳ từ máy trong mạng công ty giống cách `quan-tri-du-an-core/scripts/sync_jira_fss.py` đang làm — xem `apps/quan-tri-du-an-core/CLAUDE.md` phần "Jira data flow" làm ví dụ tham khảo.

## 0.5. Vào worktree trước khi tạo file

Nếu đang ở branch `main`/`master`: gọi tool `EnterWorktree` (đặt tên worktree trùng `<tên-app>` cho dễ nhận biết) TRƯỚC khi tạo bất kỳ file nào ở bước 1 — hook sẽ chặn nếu bỏ qua bước này. Sau khi xong toàn bộ (kể cả bước 4), hỏi người dùng có muốn merge worktree đó vào `main` không.

## 1. Tạo khung app

Tạo `apps/<tên-app>/` với các file sau (điều chỉnh tên/mô tả cho đúng app):

`apps/<tên-app>/package.json`:
```json
{
  "name": "<tên-app>",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
```
Nếu app cần Cloudflare KV: thêm `"@sbsi/cloudflare-kv": "workspace:*"` vào `dependencies`.

`apps/<tên-app>/tsconfig.json` — copy nguyên văn từ `apps/quan-tri-du-an-core/tsconfig.json` (không cần chỉnh gì, đã là config chuẩn dùng chung).

`apps/<tên-app>/next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`apps/<tên-app>/src/app/layout.tsx`:
```tsx
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

`apps/<tên-app>/src/app/page.tsx` — trang chào mừng tối giản, thay bằng nội dung thật khi biết yêu cầu cụ thể:
```tsx
export default function Page() {
  return <main style={{ padding: 24, fontFamily: "sans-serif" }}>{"<tên-app>"} — đang phát triển</main>;
}
```

Nếu app cần Cloudflare KV, tạo thêm `apps/<tên-app>/.env.example`:
```
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_KV_NAMESPACE_ID=
CLOUDFLARE_API_TOKEN=
```
Hỏi người dùng: dùng chung KV namespace với app khác, hay tạo namespace riêng cho app này? Mặc định khuyên **namespace riêng** (tránh key của app này đụng key app khác) trừ khi họ muốn chia sẻ dữ liệu giữa các app.

KHÔNG copy `src/legacy/`, `LegacyPage.tsx`, `scripts/extract-legacy.mjs` từ `quan-tri-du-an-core` — đó là cơ chế đặc thù chỉ dùng khi fork 1 site HTML tĩnh có sẵn, không phải khung app mới tinh.

## 2. Cài đặt & build thử

```bash
pnpm install
pnpm --filter <tên-app> build
```
Sửa lỗi nếu build fail trước khi báo hoàn tất.

## 3. Viết `apps/<tên-app>/CLAUDE.md`

Dùng mẫu `docs/templates/subproject-CLAUDE-template.md` làm khung (điền đầy đủ, không để lại `TODO`), thêm 1 dòng đầu trỏ về root `CLAUDE.md` giống `apps/quan-tri-du-an-core/CLAUDE.md` đang làm.

## 4. Cập nhật root `CLAUDE.md`

Thêm 1 dòng vào bảng "Danh sách app hiện có".

## 5. Báo kết quả

Cho người dùng biết: app đã tạo ở đâu, chạy `pnpm --filter <tên-app> dev` để xem thử, còn thiếu env var gì cần điền (nếu có), và hỏi có muốn commit không (đừng tự commit nếu không được yêu cầu).
