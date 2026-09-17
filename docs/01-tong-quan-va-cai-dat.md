# Tổng quan và cách chạy

## Mục tiêu

Project này tập trung vào việc học luồng kết nối giữa React Frontend và Node.js/Express Backend. Frontend không mock API và không tự thay đổi contract Backend.

Tech stack:

- React và TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- Ant Design
- dayjs

Không sử dụng Redux. Server state được quản lý bởi TanStack Query.

## Các phase đã hoàn thành

1. Khởi tạo project và cấu trúc thư mục.
2. Axios instance, biến môi trường và health check.
3. Login, lưu token và interceptor.
4. Protected Route, Profile và Logout.
5. Register bằng OTP.
6. Category CRUD, pagination, search và sort.

Article chưa được triển khai.

## Biến môi trường

File `.env`:

```env
VITE_API_BASE_URL=http://localhost:3008/api
```

Sau khi sửa `.env`, phải dừng và chạy lại Vite.

## Chạy project

Mở hai terminal.

Terminal Backend, tại thư mục Backend:

```bash
npm run dev
```

Terminal Frontend, tại `E:\connectFE-BE`:

```bash
npm run dev
```

Các địa chỉ cần nhớ:

```text
Frontend:       http://localhost:5173
Backend:        http://localhost:3008
Health API:     http://localhost:3008/api/health
Login:          http://localhost:5173/login
Register:       http://localhost:5173/register
Profile:        http://localhost:5173/profile
Categories:     http://localhost:5173/categories
```

## Kiểm tra chất lượng code

```bash
npm run lint
npm run build
```

Vite được cấu hình `strictPort: true`. Nếu port 5173 đang bị chiếm, Vite báo lỗi thay vì tự chuyển sang port khác.
