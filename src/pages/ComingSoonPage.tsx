import { Result } from 'antd'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <Result
      status="info"
      title={title}
      subTitle="Route đã được bảo vệ. Chức năng sẽ được triển khai ở phase tương ứng."
    />
  )
}
