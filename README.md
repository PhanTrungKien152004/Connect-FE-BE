# Connect Frontend

Frontend học tập dùng React + TypeScript để kết nối Backend Node.js/Express qua API thật.

Project đã hoàn thành Phase 1–6:

- Khởi tạo Vite và cấu trúc source.
- Axios instance và health check.
- Login, lưu JWT và interceptor.
- Access token chỉ ở memory; refresh token trong HttpOnly cookie do Backend quản lý.
- Khôi phục phiên khi reload và tự retry một lần khi access token hết hạn.
- Logout gọi Backend để xóa HttpOnly refresh cookie rồi dọn phiên Frontend.
- Protected Route, Profile và Logout.
- Register theo flow Send OTP → Verify OTP → Register.
- Category CRUD, pagination, search và sort bằng TanStack Query.
- Lazy loading cho các route-level page.

## Tài liệu

- [Tổng quan và cách chạy](docs/01-tong-quan-va-cai-dat.md)
- [Kiến trúc và luồng dữ liệu](docs/02-kien-truc-va-luong-du-lieu.md)
- [Authentication](docs/03-authentication.md)
- [Đăng ký bằng OTP](docs/04-register-otp.md)
- [Category CRUD và TanStack Query](docs/05-category-crud.md)
- [Debug kết nối và lỗi thường gặp](docs/06-debug-va-loi-thuong-gap.md)

Điểm bắt đầu khi chạy project:

```bash
npm install
npm run dev
```

Frontend mặc định: <http://localhost:5173>

Backend mặc định: <http://localhost:3008>
