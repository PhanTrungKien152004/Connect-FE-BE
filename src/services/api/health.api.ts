import apiClient from '../axios'

export interface HealthResponse {
  status: number
  data: unknown
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<unknown>('/health')

  return {
    status: response.status,
    data: response.data,
  }
}
