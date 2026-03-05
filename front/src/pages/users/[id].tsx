import {
  Card, Avatar, Button, Tag, Spin, Typography, Descriptions, message, Space,
} from 'antd'
import {
  ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, DeleteOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAppDispatch, useAppSelector } from '../../slices/hooks'
import { fetchSavedUsers, importUser, deleteSavedUser } from '../../slices/usersSlice'
import api from '../../services/api'
import { ReqResUser } from '../../types'

const { Title, Text } = Typography

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useAppDispatch()
  const { savedUsers } = useAppSelector((state) => state.users)

  const [user, setUser] = useState<ReqResUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isSaved = savedUsers.some((u) => u.id === Number(id))

  useEffect(() => {
    dispatch(fetchSavedUsers())
  }, [dispatch])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/users/reqres/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    const result = await dispatch(importUser(Number(id)))
    if (importUser.fulfilled.match(result)) {
      message.success('User saved locally!')
    } else {
      message.error('Failed to save user')
    }
  }

  const handleDelete = async () => {
    const result = await dispatch(deleteSavedUser(Number(id)))
    if (deleteSavedUser.fulfilled.match(result)) {
      message.success('User removed from local DB')
    }
  }

  if (loading) return <AppLayout><div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div></AppLayout>
  if (error || !user) return <AppLayout><div style={{ color: 'red' }}>{error ?? 'User not found'}</div></AppLayout>

  return (
    <AppLayout>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/users')}
        style={{ marginBottom: 24 }}
      >
        Back to Users
      </Button>

      <Card style={{ borderRadius: 12, maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <Avatar src={user.avatar} size={80} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {user.first_name} {user.last_name}
            </Title>
            <Text type="secondary">{user.email}</Text>
            <div style={{ marginTop: 8 }}>
              {isSaved ? (
                <Tag icon={<CheckCircleOutlined />} color="success">Saved locally</Tag>
              ) : (
                <Tag color="default">Not saved</Tag>
              )}
            </div>
          </div>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="First Name">{user.first_name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{user.last_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        </Descriptions>

        <Space style={{ marginTop: 24 }}>
          {!isSaved ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save locally
            </Button>
          ) : (
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              Remove from DB
            </Button>
          )}
        </Space>
      </Card>
    </AppLayout>
  )
}
