import { Alert, Button, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { accessTokenStore, AUTH_CHANGED_EVENT } from '../utils/accessTokenStore'

export default function ProtectedRoute() {
  const location = useLocation()
  const [hasToken, setHasToken] = useState(Boolean(accessTokenStore.get()))

  useEffect(() => {
    const syncAuthentication = () => {
      setHasToken(Boolean(accessTokenStore.get()))
    }

    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthentication)

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthentication)
    }
  }, [])

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function ProfileLoading() {
  return (
    <div className="page-state">
      <Spin size="large" />
    </div>
  )
}

export function ProfileError({ retry }: { retry: () => void }) {
  return (
    <div className="page-state">
      <Alert
        showIcon
        type="error"
        message="Không tải được thông tin người dùng"
        description={<Button onClick={retry}>Thử lại</Button>}
      />
    </div>
  )
}
