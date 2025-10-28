import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Space,
  Typography,
} from 'antd'

const { Text, Title } = Typography

function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  submitting,
  error,
  successMessage,
}) {
  const [form] = Form.useForm()

  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [items],
  )

  const handleCheckout = async () => {
    try {
      const values = await form.validateFields()
      await onCheckout(values)
      form.resetFields()
    } catch (validationError) {
      console.debug('Checkout validation skipped', validationError)
    }
  }

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      width={420}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {items.length === 0 ? (
        <Empty description="Your cart is empty">
          <Button type="primary" onClick={onClose}>
            Continue shopping
          </Button>
        </Empty>
      ) : (
        <>
          <List
            itemLayout="vertical"
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                extra={<img width={96} src={item.imageUrl} alt={item.name} style={{ borderRadius: 12 }} />}
                actions={[
                  <Space key="quantity" size="small">
                    <Text>Qty:</Text>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => onUpdateQuantity(item.id, value)}
                      size="small"
                    />
                  </Space>,
                  <Button type="link" danger onClick={() => onRemoveItem(item.id)}>
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`TZS ${(item.priceCents / 100).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </List.Item>
            )}
          />

          <Divider />
          <div className="cart-drawer__summary">
            <Title level={4}>Order summary</Title>
            <Text strong>
              Total:{' '}
              {`TZS ${(totalCents / 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </Text>
          </div>

          <Divider />
          <Title level={5}>Checkout details</Title>
          <Form
            layout="vertical"
            form={form}
            disabled={submitting}
            initialValues={{ city: 'Arusha' }}
          >
            <Form.Item
              name="customerName"
              label="Full name"
              rules={[{ required: true, message: 'Enter your name' }]}
            >
              <Input autoComplete="name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input autoComplete="email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input autoComplete="tel" />
            </Form.Item>
            <Form.Item
              name="addressLine1"
              label="Address"
              rules={[{ required: true, message: 'Enter your address' }]}
            >
              <Input autoComplete="address-line1" />
            </Form.Item>
            <Form.Item name="addressLine2" label="Apartment, suite, etc.">
              <Input autoComplete="address-line2" />
            </Form.Item>
            <Form.Item name="city" label="City / Region">
              <Input autoComplete="address-level2" />
            </Form.Item>
          </Form>

          {error ? <Alert type="error" message={error} showIcon style={{ marginTop: 16 }} /> : null}
          {successMessage ? <Alert type="success" message={successMessage} showIcon style={{ marginTop: 16 }} /> : null}

          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 24 }}
            onClick={handleCheckout}
            loading={submitting}
          >
            Confirm order
          </Button>
        </>
      )}
    </Drawer>
  )
}

CartDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    priceCents: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  })).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  successMessage: PropTypes.string,
}

CartDrawer.defaultProps = {
  error: null,
  successMessage: null,
}

export default CartDrawer
