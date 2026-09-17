# Category CRUD và TanStack Query

## API contracts

```text
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

Tất cả yêu cầu Bearer token.

Danh sách hỗ trợ:

```text
page
pageSize
keyword
sortBy=createdAt
sortOrder=asc|desc
```

Response pagination:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

## Query key

```ts
['categories', { page, pageSize, keyword, sortBy, sortOrder }]
```

Tại sao phải chứa params? Mỗi tổ hợp trang, từ khóa và sort là một server state khác nhau. Query key giúp TanStack Query cache và refetch đúng dữ liệu.

## GET flow

```text
CategoriesPage cập nhật params
↓
query key thay đổi
↓
useCategories chạy queryFn
↓
getCategories(params)
↓
Axios GET /categories với query params
↓
Backend trả items + pagination
↓
TanStack Query cập nhật data
↓
Table re-render
```

`placeholderData: keepPreviousData` giữ bảng cũ trong lúc trang mới đang tải, tránh UI nhấp nháy.

## Mutation flow

Create, update và delete có mutation riêng:

```text
Form/Confirm
↓
mutationFn gọi category.api.ts
↓
Backend thay đổi dữ liệu
↓
onSuccess invalidateQueries(['categories'])
↓
query danh sách hiện tại refetch
↓
Table tự cập nhật
```

`invalidateQueries` tốt hơn tự sửa nhiều cache pagination bằng tay trong project học tập này: đơn giản, rõ flow và lấy lại dữ liệu chuẩn từ server.

## UI đã có

- Ant Design Table
- Pagination và page-size
- Search theo tên
- Sort createdAt tăng/giảm
- Modal create/update
- Confirm delete
- Loading, empty state và error state

`sortBy` chỉ dùng `createdAt` vì đó là giá trị đã được Swagger xác nhận.
