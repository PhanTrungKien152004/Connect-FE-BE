import axios from 'axios'
import type { ApiErrorResponse } from '../types'

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Đã xảy ra lỗi không xác định.'
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.code === 'ECONNABORTED') {
    return 'Backend không phản hồi trong 10 giây.'
  }

  if (!error.response) {
    return 'Không thể kết nối Backend. Hãy kiểm tra server và CORS.'
  }

  return `Yêu cầu thất bại với HTTP ${error.response.status}.`
}
