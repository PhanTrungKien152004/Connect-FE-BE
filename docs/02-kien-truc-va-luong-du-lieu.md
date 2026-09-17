# Kiến trúc và luồng dữ liệu

## Cấu trúc source

```text
src/
├── components/       Component dùng lại
├── contexts/         Global client state nếu thực sự cần
├── hooks/            TanStack Query hooks
├── layouts/          Main layout, sidebar và header
├── pages/            Component cấp route
├── routes/           Protected Route
├── services/
│   ├── api/          Service theo resource Backend
│   └── axios.ts      Axios instance dùng chung
├── types/             TypeScript types theo Backend contract
├── utils/             Token storage và error helper
├── App.tsx            Khai báo routes
└── main.tsx           Khởi tạo React và providers
```

## Trách nhiệm từng lớp

### React page

Hiển thị UI, nhận input và gọi query/mutation. Page không tự gọi `axios.get()` hoặc `axios.post()`.

### TanStack Query hook

Quản lý server state:

- loading
- error
- data
- cache
- refetch
- invalidation sau mutation

### API service

Biết endpoint, HTTP method, request và response type. Ví dụ:

```ts
apiClient.get('/categories', { params })
```

### Axios instance

Quản lý cấu hình HTTP dùng chung:

- `baseURL`
- timeout
- header chung
- request interceptor gắn Bearer token
- response interceptor xử lý 401

## Luồng tổng quát

```text
React Component
↓
TanStack Query / Mutation
↓
API Service
↓
Axios Instance
↓
HTTP Request
↓
Express Route
↓
Controller
↓
Service
↓
Repository
↓
Prisma
↓
PostgreSQL
↓
HTTP Response
↓
Axios
↓
TanStack Query cập nhật cache/state
↓
React re-render
↓
UI
```

## Query và Mutation

`useQuery` dùng cho thao tác đọc dữ liệu, ví dụ health, profile và danh sách category.

`useMutation` dùng cho hành động như login, send OTP, verify OTP, register, create, update và delete.

Không dùng `useEffect` để gọi API. `useEffect` trong Register chỉ dùng để chạy countdown OTP.

## Lazy loading theo route

Các page được tải bằng `React.lazy`:

```ts
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
```

Toàn bộ routes được bọc bởi `Suspense` với loading fallback. Khi người dùng chưa truy cập `/categories`, browser chưa cần tải chunk riêng của `CategoriesPage`.

Layout và Protected Route không lazy-load vì đây là khung nhỏ, cần thiết ngay khi vào vùng đã đăng nhập. Lazy loading tập trung ở các route-level page:

- Login
- Register
- Dashboard
- Profile
- Categories
- Articles placeholder

Các file `pages/index.ts` vẫn có thể dùng ở nơi khác, nhưng `App.tsx` import động trực tiếp từng file để bundler tạo chunk rõ ràng.
