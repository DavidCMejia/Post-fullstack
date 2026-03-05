import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from 'axios'
import { useAppDispatch } from '../slices/hooks'
import { setCredentials } from '../slices/authSlice'

const { Title, Text } = Typography

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      // Step 1: Login directly to ReqRes from the browser (bypasses Cloudflare)
      const reqresRes = await axios.post('https://reqres.in/api/login', {
        email: values.email,
        password: values.password,
      })

      // Step 2: Send the ReqRes token to our Next API route
      // which forwards to Express to generate our own JWT
      const res = await axios.post('/api/auth/login', {
        email: values.email,
        reqresToken: reqresRes.data.token,
      })

      localStorage.setItem('token', res.data.token)
      dispatch(setCredentials({ token: res.data.token, email: values.email }))
      router.push('/dashboard')
    } catch (err: any) {
      const message = err.response?.data?.error ?? err.response?.data ?? 'Login failed. Check your credentials.'
      setError(typeof message === 'string' ? message : 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #141414 0%, #1a1a2e 100%)',
    }}>
      <Card
        style={{ width: 400, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0 }}>Welcome back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="eve.holt@reqres.in" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="cityslicka" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo credentials: <strong>eve.holt@reqres.in</strong> / <strong>cityslicka</strong>
          </Text>
        </div>
      </Card>
    </div>
  )
}
