import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Empty, Flex, Image, Popconfirm, Row, Space, Spin, Tag, Typography, message } from 'antd'
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import './GalleryPage.css'

const { Title, Text } = Typography

function GalleryPage({ token, onLogout }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const authHeaders = useMemo(() => (token ? { 'X-Admin-Token': token } : {}), [token])

  const loadItems = useCallback(async () => {
    if (!token) {
      return
    }
    setLoading(true)
    try {
      const response = await client.get('/api/admin/furniture', { headers: authHeaders })
      setItems(response.data)
    } catch (error) {
      message.error('Failed to load gallery items')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, token])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/admin/furniture/${id}`, { headers: authHeaders })
      message.success('Furniture deleted')
      loadItems()
    } catch (error) {
      message.error('Failed to delete item')
    }
  }

  const handleEdit = (item) => {
    navigate('/', { state: { editItem: item } })
  }

  return (
    <div className="layout-page gallery">
      <Flex justify="space-between" align="center" className="gallery__header">
        <Space size="small">
          <PictureOutlined className="gallery__header-icon" />
          <Title level={3} className="gallery__title">
            Image Library
          </Title>
        </Space>
        <Space>
          <Button type="primary" onClick={() => navigate('/')}>
            Upload new
          </Button>
          <Button onClick={onLogout}>Log out</Button>
        </Space>
      </Flex>

      <Card className="gallery__card">
        <Spin spinning={loading}>
          <div className="gallery__content">
            {items.length > 0 ? (
              <Row gutter={[16, 16]}>
                {items.map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item.id}>
                    <Card className="gallery__item-card" hoverable>
                      <div className="gallery__image-wrapper">
                        <Image src={item.imageUrl} alt={item.name} preview />
                      </div>
                      <div className="gallery__item-body">
                        <Flex justify="space-between" align="center">
                          <Title level={4} className="gallery__item-title">
                            {item.name}
                          </Title>
                          <Tag color="blue">{item.category}</Tag>
                        </Flex>
                        <Text type="secondary">
                          {item.description || 'No description provided'}
                        </Text>
                        <Text className="gallery__price">
                          {item.priceCents
                            ? `TZS ${(item.priceCents / 100).toLocaleString()}`
                            : 'No price set'}
                        </Text>
                        <Space>
                          <Button icon={<EditOutlined />} onClick={() => handleEdit(item)}>
                            Edit
                          </Button>
                          <Popconfirm
                            title="Delete this item?"
                            okText="Delete"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleDelete(item.id)}
                          >
                            <Button danger icon={<DeleteOutlined />}>
                              Delete
                            </Button>
                          </Popconfirm>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No furniture uploaded yet" />
            )}
          </div>
        </Spin>
      </Card>
    </div>
  )
}

export default GalleryPage
