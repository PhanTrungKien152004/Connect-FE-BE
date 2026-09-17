import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Card, Form, Input, Typography, message } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import type { LoginRequest } from '../types'
import { getApiErrorMessage } from '../utils/apiError'
import { accessTokenStore } from '../utils/accessTokenStore'

const { Paragraph, Title } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      accessTokenStore.set(response.data.accessToken)
      messageApi.success(response.message)
      navigate('/', { replace: true })
    },
  })

  if (accessTokenStore.get()) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values)
  }

  return (
    <main className="app-shell">
      {contextHolder}
      <Card className="auth-card">
        <Title level={1}>Đăng nhập</Title>
        <Paragraph type="secondary">
          Nhập tài khoản Backend để nhận access token và refresh token.
        </Paragraph>

        {loginMutation.isError && (
          <Alert
            showIcon
            type="error"
            message="Đăng nhập thất bại"
            description={getApiErrorMessage(loginMutation.error)}
          />
        )}

        <Form<LoginRequest>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập username.' }]}
          >
            <Input autoComplete="username" placeholder="Nhập username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập password.' }]}
          >
            <Input.Password
              autoComplete="current-password"
              placeholder="Nhập password"
            />
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={loginMutation.isPending}
          >
            Đăng nhập
          </Button>
        </Form>
        <Paragraph className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </Paragraph>
      </Card>
    </main>
  )
}
