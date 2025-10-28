import { useState } from 'react'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import client from '../api/client'
import './LoginPage.css'

const { Title } = Typography

function LoginPage({ onAuthenticated }) {
  const [loading, setLoading] = useState(false)

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      const response = await client.post('/api/admin/login', values)
      onAuthenticated(response.data.token)
      message.success('Welcome back')
    } catch (error) {
      message.error(error?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout-page login-page">
      <Card className="login-card">
        <Title level={3} className="login-title">
          Bigsofa Admin
        </Title>
        <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
