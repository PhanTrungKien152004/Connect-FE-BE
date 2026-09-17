import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../services/api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
    staleTime: 60_000,
  })
}
