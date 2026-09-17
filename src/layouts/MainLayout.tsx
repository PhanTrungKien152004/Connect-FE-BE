import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Layout, Menu, Space, Typography, message } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks'
import { logout } from '../services/api'
import { getApiErrorMessage } from '../utils/apiError'
import { accessTokenStore } from '../utils/accessTokenStore'
import { ProfileError, ProfileLoading } from '../routes/ProtectedRoute'

const { Header, Content, Sider } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/', label: 'Dashboard' },
  { key: '/categories', label: 'Categories' },
  { key: '/articles', label: 'Articles' },
  { key: '/profile', label: 'Profile' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [messageApi, messageContext] = message.useMessage()
  const profileQuery = useProfile()

  const finishClientLogout = () => {
    accessTokenStore.clear()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      messageApi.success(response.message)
      finishClientLogout()
    },
    onError: (error) => {
      messageApi.error(
        `${getApiErrorMessage(error)} Phiên trên trình duyệt vẫn được kết thúc.`,
      )
      finishClientLogout()
    },
  })

  if (profileQuery.isPending) return <ProfileLoading />
  if (profileQuery.isError) {
    return <ProfileError retry={() => void profileQuery.refetch()} />
  }

  return (
    <Layout className="main-layout">
      {messageContext}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="brand">Connect App</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="main-header">
          <Space>
            <Text strong>{profileQuery.data.data.fullName}</Text>
            <Button
              loading={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content className="main-content">
          <Outlet context={profileQuery.data.data} />
        </Content>
      </Layout>
    </Layout>
  )
}
