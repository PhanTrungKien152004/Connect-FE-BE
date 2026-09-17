import type {
  CategoryListParams,
  CategoryListResponse,
  CategoryPayload,
  CategoryResponse,
  DeleteCategoryResponse,
} from '../../types'
import apiClient from '../axios'

export async function getCategories(
  params: CategoryListParams,
): Promise<CategoryListResponse> {
  const response = await apiClient.get<CategoryListResponse>('/categories', {
    params,
  })
  return response.data
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
  const response = await apiClient.get<CategoryResponse>(`/categories/${id}`)
  return response.data
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<CategoryResponse> {
  const response = await apiClient.post<CategoryResponse>('/categories', payload)
  return response.data
}

export async function updateCategory({
  id,
  payload,
}: {
  id: number
  payload: CategoryPayload
}): Promise<CategoryResponse> {
  const response = await apiClient.put<CategoryResponse>(
    `/categories/${id}`,
    payload,
  )
  return response.data
}

export async function deleteCategory(
  id: number,
): Promise<DeleteCategoryResponse> {
  const response = await apiClient.delete<DeleteCategoryResponse>(
    `/categories/${id}`,
  )
  return response.data
}
