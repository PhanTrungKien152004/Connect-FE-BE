import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks'
import type { Category, CategoryListParams, CategoryPayload } from '../types'
import { getApiErrorMessage } from '../utils/apiError'

const { Title } = Typography

export default function CategoriesPage() {
  const [messageApi, messageContext] = message.useMessage()
  const [modalApi, modalContext] = Modal.useModal()
  const [form] = Form.useForm<CategoryPayload>()
  const [keywordInput, setKeywordInput] = useState('')
  const [params, setParams] = useState<CategoryListParams>({
    page: 1,
    pageSize: 10,
    keyword: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categoriesQuery = useCategories(params)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const openCreateModal = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue({ name: category.name, description: category.description })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    form.resetFields()
    createMutation.reset()
    updateMutation.reset()
  }

  const submitCategory = async () => {
    const payload = await form.validateFields()
    try {
      const response = editingCategory
        ? await updateMutation.mutateAsync({ id: editingCategory.id, payload })
        : await createMutation.mutateAsync(payload)
      messageApi.success(response.message)
      closeModal()
      if (!editingCategory) setParams((current) => ({ ...current, page: 1 }))
    } catch {
      // Mutation state is rendered inside the modal.
    }
  }

  const confirmDelete = (category: Category) => {
    modalApi.confirm({
      title: 'Xóa danh mục?',
      content: `Bạn sắp xóa “${category.name}”.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteMutation.mutateAsync(category.id)
          messageApi.success(response.message)
        } catch (error) {
          messageApi.error(getApiErrorMessage(error))
          throw error
        }
      },
    })
  }

  const columns: ColumnsType<Category> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, category) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(category)}>Sửa</Button>
          <Button danger size="small" onClick={() => confirmDelete(category)}>Xóa</Button>
        </Space>
      ),
    },
  ]

  const mutationError = createMutation.error ?? updateMutation.error

  return (
    <Card>
      {messageContext}
      {modalContext}
      <div className="page-heading">
        <Title level={2}>Categories</Title>
        <Button type="primary" onClick={openCreateModal}>Tạo danh mục</Button>
      </div>

      <Space wrap className="table-toolbar">
        <Input.Search
          allowClear
          value={keywordInput}
          placeholder="Tìm theo tên danh mục"
          onChange={(event) => setKeywordInput(event.target.value)}
          onSearch={(keyword) => setParams((current) => ({ ...current, keyword, page: 1 }))}
        />
        <Select
          value={params.sortOrder}
          options={[
            { value: 'desc', label: 'Mới nhất trước' },
            { value: 'asc', label: 'Cũ nhất trước' },
          ]}
          onChange={(sortOrder) => setParams((current) => ({ ...current, sortOrder, page: 1 }))}
        />
      </Space>

      {categoriesQuery.isError && (
        <Alert
          showIcon
          type="error"
          message="Không tải được danh mục"
          description={getApiErrorMessage(categoriesQuery.error)}
          action={<Button onClick={() => void categoriesQuery.refetch()}>Thử lại</Button>}
        />
      )}

      <Table<Category>
        rowKey="id"
        columns={columns}
        dataSource={categoriesQuery.data?.data.items ?? []}
        loading={categoriesQuery.isFetching}
        locale={{ emptyText: 'Chưa có danh mục' }}
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: categoriesQuery.data?.data.pagination.totalItems ?? 0,
          showSizeChanger: true,
          onChange: (page, pageSize) => setParams((current) => ({ ...current, page, pageSize })),
        }}
      />

      <Modal
        title={editingCategory ? 'Cập nhật danh mục' : 'Tạo danh mục'}
        open={isModalOpen}
        okText={editingCategory ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onOk={() => void submitCategory()}
        onCancel={closeModal}
      >
        {mutationError && (
          <Alert showIcon type="error" message={getApiErrorMessage(mutationError)} />
        )}
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
