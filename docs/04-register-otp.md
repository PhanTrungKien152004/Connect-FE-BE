# Đăng ký bằng OTP

## API contracts

### Gửi OTP

```text
POST /api/auth/register/send-otp
Body: { "email": "..." }
```

Backend trả `data.expiresInSeconds`. UI dùng giá trị này để countdown.

### Xác minh OTP

```text
POST /api/auth/register/verify-otp
Body: { "email": "...", "otp": "......" }
```

Backend trả `data.verified`.

### Tạo tài khoản

```text
POST /api/auth/register
```

```json
{
  "username": "...",
  "email": "...",
  "password": "...",
  "fullName": "..."
}
```

## Flow ba bước

```text
Bước 1: Nhập thông tin
↓
Send OTP mutation
↓
Bước 2: Nhập OTP và countdown
↓
Verify OTP mutation
↓
Bước 3: Xác nhận hoàn tất
↓
Register mutation
↓
Chuyển /login
```

Mỗi API có một mutation riêng để dễ quan sát loading, error và response của từng bước.

## Nguyên tắc dữ liệu

- OTP không lưu vào Local Storage.
- OTP chỉ tồn tại trong Ant Design Form/React memory.
- `confirmPassword` chỉ dùng validate phía Frontend, không gửi Backend.
- Register request không gửi lại OTP vì contract Backend không yêu cầu.
- Resend chỉ được bật sau khi countdown kết thúc.

Lỗi 400, 409, 429 và các status khác được đọc từ response Backend và hiển thị trên UI.
