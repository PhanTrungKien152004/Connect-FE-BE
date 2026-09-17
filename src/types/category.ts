export interface Category {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CategoryPayload {
  name: string
  description: string
}

export interface CategoryListParams {
  page: number
  pageSize: number
  keyword?: string
  sortBy: 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CategoryListResponse {
  success: boolean
  message: string
  data: {
    items: Category[]
    pagination: PaginationMeta
  }
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: Category
}

export interface DeleteCategoryResponse {
  success: boolean
  message: string
  data: null
}
