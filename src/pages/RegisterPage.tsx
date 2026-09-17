import { useMutation } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  Steps,
  Typography,
  message,
} from 'antd'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  register,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from '../services/api'
import type { RegisterRequest } from '../types'
import { getApiErrorMessage } from '../utils/apiError'
import { accessTokenStore } from '../utils/accessTokenStore'

const { Paragraph, Text, Title } = Typography

type RegistrationDetails = RegisterRequest & { confirmPassword: string }

export default function RegisterPage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [currentStep, setCurrentStep] = useState(0)
  const [details, setDetails] = useState<RegistrationDetails | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (remainingSeconds <= 0) return
    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [remainingSeconds])

  const sendOtpMutation = useMutation({
    mutationFn: sendRegistrationOtp,
    onSuccess: (response) => {
      setRemainingSeconds(response.data.expiresInSeconds)
      setCurrentStep(1)
      messageApi.success(response.message)
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: verifyRegistrationOtp,
    onSuccess: (response) => {
      if (response.data.verified) {
        setCurrentStep(2)
        messageApi.success(response.message)
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      messageApi.success(response.message)
      navigate('/login', { replace: true })
    },
  })

  if (accessTokenStore.get()) return <Navigate to="/" replace />

  const handleDetails = (values: RegistrationDetails) => {
    setDetails(values)
    sendOtpMutation.mutate({ email: values.email })
  }

  const handleVerify = ({ otp }: { otp: string }) => {
    if (!details) return
    verifyOtpMutation.mutate({ email: details.email, otp })
  }

  const handleRegister = () => {
    if (!details) return
    registerMutation.mutate({
      username: details.username,
      email: details.email,
      password: details.password,
      fullName: details.fullName,
    })
  }

  const handleResend = () => {
    if (!details) return
    sendOtpMutation.mutate({ email: details.email })
  }

  const activeError =
    sendOtpMutation.error ?? verifyOtpMutation.error ?? registerMutation.error

  return (
    <main className="app-shell">
      {contextHolder}
      <Card className="register-card">
        <Title level={1}>Đăng ký tài khoản</Title>
        <Steps
          current={currentStep}
          size="small"
          items={[
            { title: 'Thông tin' },
            { title: 'Xác minh OTP' },
            { title: 'Hoàn tất' },
          ]}
        />

        {activeError && (
          <Alert
            showIcon
            type="error"
            message="Yêu cầu không thành công"
            description={getApiErrorMessage(activeError)}
          />
        )}

        {currentStep === 0 && (
          <Form<RegistrationDetails>
            layout="vertical"
            requiredMark={false}
            onFinish={handleDetails}
          >
            <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ.' }]}>
              <Input autoComplete="email" />
            </Form.Item>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Vui lòng nhập username.' }]}>
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Vui lòng nhập password.' }]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              label="Nhập lại password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng nhập lại password.' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return !value || getFieldValue('password') === value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Hai password không trùng nhau.'))
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Button block type="primary" htmlType="submit" loading={sendOtpMutation.isPending}>
              Gửi OTP
            </Button>
          </Form>
        )}

        {currentStep === 1 && details && (
          <Form<{ otp: string }> layout="vertical" requiredMark={false} onFinish={handleVerify}>
            <Paragraph>
              OTP đã được gửi tới <Text strong>{details.email}</Text>.
            </Paragraph>
            <Form.Item
              label="Mã OTP"
              name="otp"
              rules={[
                { required: true, message: 'Vui lòng nhập OTP.' },
                { len: 6, message: 'OTP phải gồm 6 ký tự.' },
              ]}
            >
              <Input.OTP length={6} />
            </Form.Item>
            <Space wrap>
              <Button type="primary" htmlType="submit" loading={verifyOtpMutation.isPending}>
                Xác minh OTP
              </Button>
              <Button disabled={remainingSeconds > 0} loading={sendOtpMutation.isPending} onClick={handleResend}>
                {remainingSeconds > 0 ? `Gửi lại sau ${remainingSeconds}s` : 'Gửi lại OTP'}
              </Button>
              <Button onClick={() => setCurrentStep(0)}>Sửa thông tin</Button>
            </Space>
          </Form>
        )}

        {currentStep === 2 && details && (
          <Space direction="vertical" size="middle">
            <Alert showIcon type="success" message="Email đã được xác minh" description={details.email} />
            <Paragraph>Nhấn hoàn tất để tạo tài khoản <Text strong>{details.username}</Text>.</Paragraph>
            <Button type="primary" loading={registerMutation.isPending} onClick={handleRegister}>
              Hoàn tất đăng ký
            </Button>
          </Space>
        )}

        <Paragraph className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </Paragraph>
      </Card>
    </main>
  )
}
