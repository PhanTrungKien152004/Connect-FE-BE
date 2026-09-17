import { Card, Descriptions, Tag, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import type { User } from '../types'

const { Title } = Typography

export default function ProfilePage() {
  const user = useOutletContext<User>()

  return (
    <Card>
      <Title level={2}>Thông tin cá nhân</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{user.fullName}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          <Tag color="blue">{user.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={user.isActive ? 'green' : 'red'}>
            {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
