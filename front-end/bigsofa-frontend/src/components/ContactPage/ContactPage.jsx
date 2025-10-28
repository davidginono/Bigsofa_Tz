import React from 'react'
import { Card, Col, Flex, Row, Space, Tag, Typography } from 'antd'
import { ClockCircleOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, PushpinOutlined, SmileOutlined } from '@ant-design/icons'
import './ContactPage.css'

const { Title, Text, Paragraph } = Typography

const hours = [
  { label: 'Sunday 9:00 AM – Friday 3:00 PM', value: 'Closed on Saturdays' },
]

function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-page__hero">
        <div className="contact-page__hero-content">
          <Tag color="gold" className="contact-page__hero-tag">We’re here for you</Tag>
          <Title level={2} className="contact-page__hero-title">Let’s design something beautiful together</Title>
          <Paragraph className="contact-page__hero-copy">
            Reach out to Bigsofa Tanzania for bespoke furniture, showroom visits, or design consultations.
            Our team responds swiftly to help bring your project to life.
          </Paragraph>
        </div>
      </section>

      <Row gutter={[24, 24]} className="contact-page__grid">
        <Col xs={24} lg={14}>
          <Card className="contact-card" bordered={false}>
            <Space direction="vertical" size="large">
              <div>
                <Title level={4}>Get in Touch</Title>
                <Paragraph>Choose the channel that suits you best.</Paragraph>
              </div>

              <Flex vertical gap={16}>
                <Flex align="center" gap={12} className="contact-card__row">
                  <MailOutlined className="contact-card__icon" />
                  <div>
                    <Text strong>Email</Text>
                    <div>jbhoke11@gmail.com</div>
                  </div>
                </Flex>
                <Flex align="center" gap={12} className="contact-card__row">
                  <PhoneOutlined className="contact-card__icon" />
                  <div>
                    <Text strong>Phone</Text>
                    <div>0767241639</div>
                  </div>
                </Flex>
                <Flex align="center" gap={12} className="contact-card__row">
                  <InstagramOutlined className="contact-card__icon" />
                  <div>
                    <Text strong>Instagram</Text>
                    <div>@bigsofatanzania</div>
                  </div>
                </Flex>
                <Flex align="center" gap={12} className="contact-card__row">
                  <PushpinOutlined className="contact-card__icon" />
                  <div>
                    <Text strong>Showroom</Text>
                    <div>Meru Street, Njiro Rd, 23114 — Big Sofa Tanzania</div>
                  </div>
                </Flex>
              </Flex>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="contact-card" bordered={false}>
            <Space direction="vertical" size="large">
              <div>
                <Title level={4}><ClockCircleOutlined /> Store Hours</Title>
                <Paragraph>Visit our showroom or schedule a private appointment.</Paragraph>
              </div>
              <Flex vertical gap={12}>
                {hours.map((entry) => (
                  <div key={entry.label} className="contact-card__hours">
                    <Text strong>{entry.label}</Text>
                    <Text type="secondary">{entry.value}</Text>
                  </div>
                ))}
              </Flex>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="contact-card contact-card--service" bordered={false}>
        <Flex align="center" gap={16} wrap>
          <SmileOutlined className="contact-card__icon contact-card__icon--large" />
          <div>
            <Title level={4}>Customer Care</Title>
            <Paragraph>
              Our service specialists are on hand Sunday through Friday between 9:00 AM and 3:00 PM.
              Ask about custom upholstery, delivery logistics, or aftercare for your pieces.
            </Paragraph>
          </div>
        </Flex>
      </Card>
    </div>
  )
}

export default ContactPage
