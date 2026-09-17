import { Spin } from 'antd'
import { useEffect, useState, type ReactNode } from 'react'
import { refreshAccessToken } from '../services/axios'
import { accessTokenStore } from '../utils/accessTokenStore'

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    void refreshAccessToken()
      .catch(() => {
        accessTokenStore.clear()
      })
      .finally(() => {
        if (isMounted) setIsReady(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (!isReady) {
    return (
      <div className="page-state">
        <Spin size="large" tip="Đang khôi phục phiên đăng nhập" />
      </div>
    )
  }

  return children
}
