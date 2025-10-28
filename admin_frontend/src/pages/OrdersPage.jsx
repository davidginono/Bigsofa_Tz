import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Flex, List, Select, Space, Table, Tag, Typography, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import './OrdersPage.css'

const { Title, Text } = Typography

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_TAG = {
  PENDING: { color: 'gold', icon: <ClockCircleOutlined /> },
  PROCESSING: { color: 'blue', icon: <InboxOutlined /> },
  COMPLETED: { color: 'green', icon: <CheckCircleOutlined /> },
  CANCELLED: { color: 'red' },
}

function OrdersPage({ token, onLogout }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState()
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  const authHeaders = useMemo(() => (token ? { 'X-Admin-Token': token } : {}), [token])

  const loadOrders = useCallback(async () => {
    if (!token) {
      return
    }
    setLoading(true)
    try {
      const response = await client.get('/api/admin/orders', {
        headers: authHeaders,
        params: statusFilter ? { status: statusFilter } : undefined,
      })
      setOrders(response.data)
    } catch (error) {
      message.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, statusFilter, token])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusChange = async (orderId, status) => {
    if (!token) {
      message.error('Admin session expired. Please sign in again.')
      return
    }
    setUpdatingId(orderId)
    try {
      await client.patch(
        `/api/admin/orders/${orderId}`,
        { status },
        { headers: authHeaders },
      )
      message.success('Order updated')
      loadOrders()
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update order')
    } finally {
      setUpdatingId(null)
    }
  }

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'id',
      key: 'id',
      width: 90,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <div>{record.email}</div>
          {record.phone ? <div>{record.phone}</div> : null}
        </div>
      ),
    },
    {
      title: 'Delivery',
      key: 'delivery',
      render: (_, record) => (
        <div>
          <div>{record.addressLine1}</div>
          {record.addressLine2 ? <div>{record.addressLine2}</div> : null}
          {record.city ? <div>{record.city}</div> : null}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalCents',
      key: 'totalCents',
      render: (value) => (value != null
        ? `TZS ${(value / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => (
        <Space>
          <Tag color={STATUS_TAG[value]?.color || 'default'}>
            {value}
          </Tag>
          <Select
            value={value}
            onChange={(nextStatus) => handleStatusChange(record.id, nextStatus)}
            options={STATUS_OPTIONS}
            size="small"
            loading={updatingId === record.id}
            style={{ minWidth: 140 }}
          />
        </Space>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleString(),
      responsive: ['md'],
    },
  ]

  const expandedRowRender = (record) => (
    <List
      size="small"
      bordered
      dataSource={record.items}
      renderItem={(item) => (
        <List.Item>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>{item.itemName}</span>
            <span>
              {item.quantity} ×
              {` TZS ${(item.priceCents / 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </span>
          </Space>
        </List.Item>
      )}
    />
  )

  return (
    <div className="layout-page orders">
      <Flex justify="space-between" align="center" className="orders__header">
        <Title level={3} className="orders__title">Orders</Title>
        <Space>
          <Select
            allowClear
            placeholder="Filter status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
          />
          <Button onClick={loadOrders}>Refresh</Button>
          <Button onClick={() => navigate('/')}>Inventory</Button>
          <Button onClick={onLogout}>Log out</Button>
        </Space>
      </Flex>

      <Card className="orders__card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={orders}
          columns={columns}
          expandable={{ expandedRowRender }}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  )
}

OrdersPage.propTypes = {
  token: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
}

OrdersPage.defaultProps = {
  token: null,
}

export default OrdersPage
