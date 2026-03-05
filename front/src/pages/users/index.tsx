import {
  Card, Row, Col, Input, Pagination, Avatar, Tag, Button,
  Spin, Empty, Typography, message, Tooltip,
} from 'antd'
import { SearchOutlined, SaveOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import AppLayout from '../../components/layout/AppLayout'
import { useAppDispatch, useAppSelector } from '../../slices/hooks'
import {
  fetchReqResUsers, fetchSavedUsers, importUser,
  setSearchQuery, setCurrentPage,
} from '../../slices/usersSlice'

const { Title, Text } = Typography

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { reqresUsers, savedUsers, loading, error, searchQuery, currentPage, totalPages } = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchReqResUsers(currentPage))
    dispatch(fetchSavedUsers())
  }, [dispatch, currentPage])

  const isSaved = (id: number) => savedUsers.some((u) => u.id === id)

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return reqresUsers
    const q = searchQuery.toLowerCase()
    return reqresUsers.filter((u) =>
      u.first_name.toLowerCase().includes(q) ||
      u.last_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  }, [reqresUsers, searchQuery])

  const handleImport = async (id: number) => {
    const result = await dispatch(importUser(id))
    if (importUser.fulfilled.match(result)) {
      message.success('User saved locally!')
    } else {
      message.error('Failed to save user')
    }
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Users</Title>
        <Text type="secondary">{savedUsers.length} saved locally</Text>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        style={{ marginBottom: 24, maxWidth: 400 }}
        allowClear
      />

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Empty description="No users found" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {filteredUsers.map((user) => (
              <Col xs={24} sm={12} lg={8} key={user.id}>
                <Card
                  style={{ borderRadius: 12 }}
                  actions={[
                    <Tooltip title="View detail" key="view">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        Detail
                      </Button>
                    </Tooltip>,
                    isSaved(user.id) ? (
                      <Tag icon={<CheckCircleOutlined />} color="success" key="saved" style={{ margin: 0 }}>
                        Saved
                      </Tag>
                    ) : (
                      <Button
                        key="save"
                        type="text"
                        icon={<SaveOutlined />}
                        onClick={() => handleImport(user.id)}
                      >
                        Save
                      </Button>
                    ),
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar src={user.avatar} size={48} />}
                    title={`${user.first_name} ${user.last_name}`}
                    description={user.email}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {!searchQuery && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <Pagination
                current={currentPage}
                total={totalPages * 6}
                pageSize={6}
                onChange={(page) => dispatch(setCurrentPage(page))}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </AppLayout>
  )
}
