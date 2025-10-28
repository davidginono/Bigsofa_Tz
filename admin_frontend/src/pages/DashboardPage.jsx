import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Flex, Form, Image, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Typography, Upload, message } from 'antd'
import { UploadOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import client from '../api/client'
import './DashboardPage.css'

const { Title, Text } = Typography

function DashboardPage({ token, onLogout }) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const [editingItem, setEditingItem] = useState(null)
  const formSectionRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    loadCategories()
    loadItems()
  }, [])

  useEffect(() => {
    const incoming = location.state?.editItem
    if (!incoming) {
      return
    }

    const resolvedCategoryId = incoming.categoryId ?? categories.find((c) => c.name === incoming.category)?.id
    if (incoming.categoryId === undefined && resolvedCategoryId === undefined) {
      return
    }

    setEditingItem(incoming)
    form.setFieldsValue({
      categoryId: resolvedCategoryId,
      name: incoming.name,
      description: incoming.description,
      priceTzs: typeof incoming.priceCents === 'number' ? incoming.priceCents / 100 : undefined,
    })
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    navigate('/', { replace: true, state: null })
  }, [location.state, categories, form, navigate])

  const authHeaders = useMemo(() => (token ? { 'X-Admin-Token': token } : {}), [token])

  async function loadCategories() {
    try {
      const response = await client.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      message.error('Failed to load categories')
    }
  }

  async function loadItems() {
    if (!token) {
      return
    }
    setLoading(true)
    try {
      const response = await client.get('/api/admin/furniture', { headers: authHeaders })
      setItems(response.data)
    } catch (error) {
      message.error('Failed to load furniture items')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (values) => {
    if (!token) {
      message.error('Missing admin session. Please sign in again.')
      return
    }
    const { priceTzs, ...restValues } = values
    const normalizedValues = {
      ...restValues,
      priceCents:
        priceTzs !== undefined && priceTzs !== null && !Number.isNaN(Number(priceTzs))
          ? Math.round(Number(priceTzs) * 100)
          : undefined,
    }

    const formData = new FormData()
    Object.entries(normalizedValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'file') {
          const fileWrapper = Array.isArray(value) ? value[0] : value
          if (fileWrapper?.originFileObj) {
            formData.append('file', fileWrapper.originFileObj)
          }
        } else {
          formData.append(key, typeof value === 'string' ? value : String(value))
        }
      }
    })

    try {
      setSubmitting(true)
      if (editingItem) {
        await client.put(`/api/admin/furniture/${editingItem.id}`, formData, {
          headers: {
            ...authHeaders,
            'Content-Type': 'multipart/form-data',
          },
        })
        message.success('Furniture updated')
      } else {
        await client.post('/api/admin/furniture', formData, {
          headers: {
            ...authHeaders,
            'Content-Type': 'multipart/form-data',
          },
        })
        Modal.success({
          title: 'Upload successful',
          content: `"${values.name}" has been saved to the catalogue.`,
        })
        message.success('Furniture created')
      }
      form.resetFields()
      setEditingItem(null)
      loadItems()
    } catch (error) {
      message.error(error?.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (record) => {
    setEditingItem(record)
    form.setFieldsValue({
      categoryId: record.categoryId || categories.find((c) => c.name === record.category)?.id,
      name: record.name,
      description: record.description,
      priceTzs: typeof record.priceCents === 'number' ? record.priceCents / 100 : undefined,
    })
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (value, record) => <Image width={80} src={record.imageUrl} />, onCell: () => ({ style: { minWidth: 120 } }),
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Price',
      dataIndex: 'priceCents',
      key: 'priceCents',
      render: (value) => (value ? `TZS ${(value / 100).toLocaleString()}` : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/admin/furniture/${id}`, { headers: authHeaders })
      message.success('Furniture deleted')
      loadItems()
    } catch (error) {
      message.error('Failed to delete item')
    }
  }

  return (
    <div className="layout-page dashboard">
      <Flex justify="space-between" align="center" className="dashboard__header">
        <Title level={3} className="dashboard__title">
          Bigsofa Admin
        </Title>
        <Space>
          <Button type="link" onClick={() => navigate('/orders')}>
            View orders
          </Button>
          <Button type="link" onClick={() => navigate('/gallery')}>
            View gallery
          </Button>
          <Button onClick={onLogout}>Log out</Button>
        </Space>
      </Flex>

      <div ref={formSectionRef}>
        <Card className="dashboard__form-card" title={editingItem ? 'Edit furniture' : 'Upload new furniture'}>
          <Form form={form} layout="vertical" onFinish={handleUpload} requiredMark={false}>
            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Choose category' }]}> 
              <Select placeholder="Select category">
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="priceTzs" label="Price (TZS)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                formatter={(value) =>
                  typeof value === 'number' || (typeof value === 'string' && value)
                    ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                }
                parser={(value) => value?.replace(/,/g, '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="file"
              label="Image"
              valuePropName="fileList"
              rules={[{ required: !editingItem, message: 'Upload image' }]}
              getValueFromEvent={(event) => event?.fileList ?? []}
            >
              <Upload.Dragger
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                className="dashboard__uploader"
              >
                <p className="dashboard__uploader-icon">
                  <InboxOutlined />
                </p>
                <p className="dashboard__uploader-text">
                  Drag an image here or click to browse
                </p>
                <p className="dashboard__uploader-hint">
                  JPEG, PNG, or GIF files up to 5MB. Existing image stays if no file is provided.
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={editingItem ? <PlusOutlined /> : <UploadOutlined />}
                  loading={submitting}
                >
                  {editingItem ? 'Save changes' : 'Upload item'}
                </Button>
                {editingItem && (
                  <Button onClick={() => { form.resetFields(); setEditingItem(null) }}>
                    Cancel
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Card className="dashboard__table-card" title="Inventory">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  )
}

export default DashboardPage
