# Debug kết nối và lỗi thường gặp

## Checklist kết nối

1. Backend có đang chạy ở port 3008?
2. Mở trực tiếp `/api/health` có nhận JSON?
3. `.env` có đúng `VITE_API_BASE_URL`?
4. Đã restart Vite sau khi sửa `.env`?
5. Frontend có thực sự chạy ở port 5173?
6. CORS Backend có cho phép đúng origin?
7. DevTools Network báo URL/status gì?

## CORS

Backend Express cần cấu hình trước routes:

```ts
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())
app.use('/api', apiRouter)
```

Các origin sau là khác nhau:

```text
http://localhost:5173
http://localhost:5176
http://127.0.0.1:5173
https://localhost:5173
```

Một request có thể hiện HTTP 200 trong Network nhưng Axios vẫn báo Network Error nếu response thiếu/sai CORS header.

## Port bị chiếm

Kiểm tra port:

```powershell
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

Xác định process:

```powershell
Get-Process -Id <PID>
```

Chỉ khi xác nhận đó là Node/Vite cũ của mình:

```powershell
Stop-Process -Id <PID>
```

## Đọc lỗi HTTP

- `400`: request/OTP không hợp lệ hoặc hết hạn.
- `401`: thiếu token hoặc token không hợp lệ.
- `403`: có authentication nhưng không đủ quyền.
- `404`: URL hoặc route sai.
- `409`: dữ liệu đã tồn tại/xung đột.
- `429`: gửi hoặc nhập OTP quá nhiều lần.
- `500`: Backend gặp lỗi xử lý.
- `ERR_CONNECTION_REFUSED`: server chưa chạy hoặc sai port.

## Debug bằng DevTools

Trong Network, kiểm tra:

- Request URL
- Request Method
- Query String Parameters
- Request Payload
- Authorization header
- Status Code
- Response body
- Response header `Access-Control-Allow-Origin`

Không đăng token, OTP hoặc password lên ảnh chụp/log công khai.

## Debug HttpOnly cookie

Nếu Login thành công nhưng không thấy refresh cookie:

- Axios phải có `withCredentials: true`.
- CORS Backend phải có `credentials: true`.
- Response Login phải có header `Set-Cookie`.
- Kiểm tra DevTools → Application → Cookies → `http://localhost:3008`.
- HttpOnly cookie không xuất hiện qua `document.cookie`; đó là đặc tính bảo mật đúng.
