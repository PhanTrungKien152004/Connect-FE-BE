import { Card, Typography } from 'antd'
import type { User } from '../types'
import { useOutletContext } from 'react-router-dom'

const { Paragraph, Title } = Typography

export default function HomePage() {
  const user = useOutletContext<User>()

  return (
    <Card>
      <Title level={2}>Dashboard</Title>
      <Paragraph>Xin chào {user.fullName}. Authentication hiện đang hợp lệ.</Paragraph>
    </Card>
  )
}
