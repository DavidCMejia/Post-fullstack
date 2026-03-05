import { useEffect, useRef } from 'react'
import { Typography, Alert } from 'antd'
import AppLayout from '@/components/layout/AppLayout'

const { Title, Text } = Typography

export default function ApiDocsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  return (
    <AppLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>API Documentation</Title>
        <Text type="secondary">
          Powered by Swagger UI —{' '}
          <a href="http://localhost:4000/api-docs" target="_blank" rel="noreferrer">
            open in new tab
          </a>
        </Text>
      </div>

      <Alert
        message="Backend must be running on http://localhost:4000"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <iframe
        ref={iframeRef}
        src="http://localhost:4000/api-docs"
        style={{
          width: '100%',
          height: 'calc(100vh - 220px)',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
        }}
        title="API Documentation"
      />
    </AppLayout>
  )
}
