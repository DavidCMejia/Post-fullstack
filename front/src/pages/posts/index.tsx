import {
  Card, Button, Typography, Spin, Empty, Pagination,
  Popconfirm, message, Space, Tag, Modal, Form, Input, Select,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AppLayout from '../../components/layout/AppLayout'
import { useAppDispatch, useAppSelector } from '../../slices/hooks'
import { fetchPosts, createPost, deletePost } from '../../slices/postsSlice'
import { fetchSavedUsers } from '../../slices/usersSlice'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function PostsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { posts, loading, error, currentPage, totalPages, total } = useAppSelector((state) => state.posts)
  const { savedUsers } = useAppSelector((state) => state.users)

  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: 10 }))
    dispatch(fetchSavedUsers())
  }, [dispatch, currentPage])

  const handleCreate = async (values: { title: string; content: string; authorUserId: number }) => {
    setCreating(true)
    const result = await dispatch(createPost(values))
    if (createPost.fulfilled.match(result)) {
      message.success('Post created!')
      form.resetFields()
      setModalOpen(false)
    } else {
      message.error('Failed to create post')
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    const result = await dispatch(deletePost(id))
    if (deletePost.fulfilled.match(result)) {
      message.success('Post deleted')
    } else {
      message.error('Failed to delete post')
    }
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Posts</Title>
          <Text type="secondary">{total} total posts</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          New Post
        </Button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : posts.length === 0 ? (
        <Empty
          description="No posts yet"
          children={
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Create your first post
            </Button>
          }
        />
      ) : (
        <>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {posts.map((post) => (
              <Card
                key={post.id}
                style={{ borderRadius: 12 }}
                actions={[
                  <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => router.push(`/posts/${post.id}`)}>
                    View
                  </Button>,
                  <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => router.push(`/posts/${post.id}?edit=true`)}>
                    Edit
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Delete this post?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(post.id)}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                  </Popconfirm>,
                ]}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0, marginBottom: 8 }}>{post.title}</Title>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: '#666' }}>
                      {post.content}
                    </Paragraph>
                  </div>
                  {post.author && (
                    <Tag color="blue" style={{ marginLeft: 16, flexShrink: 0 }}>
                      {post.author.firstName} {post.author.lastName}
                    </Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </Card>
            ))}
          </Space>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={10}
              onChange={(page) => dispatch(fetchPosts({ page, limit: 10 }))}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <Modal
        title="Create New Post"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Title is required' },
              { min: 3, message: 'Title must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Post title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[
              { required: true, message: 'Content is required' },
              { min: 10, message: 'Content must be at least 10 characters' },
            ]}
          >
            <TextArea rows={5} placeholder="Write your post content..." />
          </Form.Item>

          <Form.Item
            label="Author"
            name="authorUserId"
            rules={[{ required: true, message: 'Please select an author' }]}
          >
            <Select placeholder="Select a saved user as author">
              {savedUsers.map((u) => (
                <Select.Option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} — {u.email}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {savedUsers.length === 0 && (
            <Text type="warning">
              No saved users yet. Go to Users and save some first.
            </Text>
          )}

          <Form.Item style={{ marginBottom: 0, marginTop: 8, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setModalOpen(false); form.resetFields() }}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={creating}>
                Create Post
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  )
}
