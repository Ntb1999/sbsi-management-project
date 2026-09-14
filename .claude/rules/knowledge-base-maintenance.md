# Knowledge Base Maintenance

Người dùng phần lớn không code — họ không nhớ (và không nên phải nhớ) để nhắc Claude cập nhật tài liệu. Việc này phải tự động xảy ra.

Do:

- Sau khi hoàn thành 1 task có ý nghĩa trên 1 app (tính năng mới, quyết định kiến trúc, đổi luồng dữ liệu, workaround/hạn chế mới phát hiện, việc còn dang dở cần làm tiếp...), **chủ động cập nhật `apps/<app>/CLAUDE.md`** — không đợi người dùng yêu cầu. Coi đây là bước cuối của task, giống như chạy build/lint.
- Ưu tiên ghi: quyết định kiến trúc + **lý do** (không chỉ "làm gì" mà cả "tại sao", để lần sau khỏi hỏi lại), việc đang dang dở/còn thiếu (env var chưa điền, chưa test được vì lý do gì, TODO cụ thể), context nghiệp vụ người dùng vừa giải thích mà không đọc code ra được.
- Nếu bảng "Danh sách app hiện có" ở root `CLAUDE.md` đã lỗi thời (mô tả ngắn không còn đúng, thiếu app mới), cập nhật luôn.
- Sửa/ghi đè phần liên quan thay vì append vô hạn — CLAUDE.md phình to dần theo thời gian sẽ mất tác dụng, không ai đọc hết.
- Báo ngắn gọn cho người dùng biết đã cập nhật CLAUDE.md, để họ biết trạng thái dự án đang được lưu lại.

Do not:

- Bịa thông tin chưa được xác nhận.
- Ghi lại thứ tự suy ra được từ đọc code (cấu trúc file, tên biến, luồng đơn giản) — chỉ ghi cái cần đọc nhiều file mới hiểu ra, hoặc chỉ người dùng mới biết (lý do, ràng buộc, quyết định, bối cảnh nghiệp vụ).
- Viết theo kiểu nhật ký/lịch sử ("hôm nay đã sửa X") — CLAUDE.md phản ánh trạng thái HIỆN TẠI của dự án, không phải log thay đổi (git log đã làm việc đó).

Load when:

- Sau khi hoàn thành bất kỳ task/session nào có thay đổi đáng kể trên 1 app — luôn tự kiểm tra, không cần trigger từ người dùng.

Skip when:

- Task quá nhỏ, không có thông tin gì mới ngoài những gì code đã tự nói lên.
