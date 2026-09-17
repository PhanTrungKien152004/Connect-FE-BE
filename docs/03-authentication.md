# Authentication

## Mô hình lưu token hiện tại

- Access token chỉ lưu trong memory của JavaScript qua `accessTokenStore`.
- Refresh token do Backend đặt trong cookie `HttpOnly`.
- Frontend không thể và không cần đọc refresh token.
- Không lưu token trong Local Storage hoặc Session Storage.

Access token trong memory sẽ mất khi refresh trang hoặc đóng tab. `AuthBootstrap` dùng refresh cookie để lấy access token mới trước khi render routes.

## Login

```text
POST /api/auth/login
```

Frontend gửi username/password với `withCredentials: true`. Backend:

1. Trả access token trong JSON response.
2. Đặt refresh token bằng response header `Set-Cookie` với cờ `HttpOnly`.

Frontend chỉ thực hiện:

```ts
accessTokenStore.set(response.data.accessToken)
```

Browser tự quản lý HttpOnly cookie; JavaScript không truy cập được cookie này.

## Axios

Axios instance bật:

```ts
withCredentials: true
```

Điều này cho phép browser nhận và gửi cookie trong request cross-origin giữa port 5173 và 3008.

Request interceptor đọc access token từ memory:

```http
Authorization: Bearer <accessToken>
```

Response `401` xóa access token khỏi memory.

## Refresh token

Contract:

```text
POST /api/auth/refresh-token
Body: không có
Cookie: refreshToken (HttpOnly, browser tự gửi)
```

Response trả `data.accessToken` mới.

### Khi reload trang

```text
React khởi động
↓
AuthBootstrap gọi POST /auth/refresh-token
↓
Browser tự gửi HttpOnly cookie
├── Thành công → lưu access token mới vào memory → render routes
└── Thất bại → không có access token → ProtectedRoute chuyển /login
```

### Khi access token hết hạn

```text
API request nhận 401
↓
Axios interceptor gọi refresh-token
↓
lưu access token mới vào memory
↓
gắn Bearer token mới
↓
retry request cũ đúng một lần
```

Refresh request dùng Axios client riêng nên không đi qua response interceptor chính. Cờ `_retry` chống vòng lặp vô hạn. `refreshPromise` dùng chung giúp nhiều request 401 đồng thời chỉ tạo một refresh request.

## Protected Route

```text
Truy cập route bảo vệ
↓
ProtectedRoute kiểm tra access token trong memory
├── Không có → /login
└── Có → gọi Profile API
    ├── 200 → render page
    └── 401 → xóa access token → /login
```

## Logout

Contract:

```text
POST /api/auth/logout
Body: không có
Cookie: refreshToken (browser tự gửi)
```

Flow:

```text
Nhấn Đăng xuất
↓
useMutation gọi POST /auth/logout
↓
Axios gửi HttpOnly cookie nhờ withCredentials
↓
Backend clearCookie(refreshToken)
↓
Frontend xóa access token memory
↓
xóa TanStack Query cache
↓
chuyển /login
```

Nếu Logout API lỗi, Frontend vẫn xóa access token và cache để kết thúc phiên UI, đồng thời hiển thị cảnh báo. Trong trường hợp đó refresh cookie có thể chưa được Backend xóa.

## CORS Backend bắt buộc

Khi dùng credential cookie, Express phải cấu hình:

```ts
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
```

Không được dùng `origin: '*'` cùng `credentials: true`.

Cookie local thường cần cấu hình tương tự phía Backend:

```ts
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
})
```

Thuộc tính cookie chính xác phải theo cấu hình Backend hiện tại. Production dùng HTTPS và thường đặt `secure: true`.
