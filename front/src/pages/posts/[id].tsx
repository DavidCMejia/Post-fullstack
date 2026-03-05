import {
  Card, Button, Typography, Spin, Tag, Space, Descriptions,
  Form, Input, Select, message, Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { fetchPost, updatePost, deletePost } from '../../slices/postsSlice';
import { fetchSavedUsers } from '../../slices/usersSlice';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function PostDetailPage() {
  const router = useRouter();
  const { id, edit } = router.query;
  const dispatch = useAppDispatch();
  const { selectedPost, loading, error } = useAppSelector((state) => state.posts);
  const { savedUsers } = useAppSelector((state) => state.users);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (edit === 'true') setIsEditing(true);
  }, [edit])

  useEffect(() => {
    if (!id) return;
    dispatch(fetchPost(id as string));
    dispatch(fetchSavedUsers());
  }, [id, dispatch])

  useEffect(() => {
    if (selectedPost && isEditing) {
      form.setFieldsValue({
        title: selectedPost.title,
        content: selectedPost.content,
        authorUserId: selectedPost.authorUserId,
      });
    }
  }, [selectedPost, isEditing, form])

  const handleUpdate = async (values: { title: string; content: string; authorUserId: number }) => {
    setSaving(true);
    const result = await dispatch(updatePost({ id: id as string, data: values }));
    if (updatePost.fulfilled.match(result)) {
      message.success('Post updated!');
      setIsEditing(false);
    } else {
      message.error('Failed to update post');
    }
    setSaving(false);
  }

  const handleDelete = async () => {
    const result = await dispatch(deletePost(id as string));
    if (deletePost.fulfilled.match(result)) {
      message.success('Post deleted');
      router.push('/posts');
    }
  }

  if (loading) return <AppLayout><div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div></AppLayout>
  if (error || !selectedPost) return <AppLayout><div style={{ color: 'red' }}>{error ?? 'Post not found'}</div></AppLayout>

  return (
    <AppLayout>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/posts')}>
          Back to Posts
        </Button>
        <Space>
          {!isEditing ? (
            <>
              <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit</Button>
              <Popconfirm
                title="Delete this post?"
                description="This action cannot be undone."
                onConfirm={handleDelete}
                okText="Delete"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>Delete</Button>
              </Popconfirm>
            </>
          ) : (
            <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>Cancel</Button>
          )}
        </Space>
      </div>

      <Card style={{ borderRadius: 12, maxWidth: 800 }}>
        {!isEditing ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Title level={3} style={{ margin: 0 }}>{selectedPost.title}</Title>
              <Space style={{ marginTop: 8 }}>
                {selectedPost.author && (
                  <Tag color="blue">{selectedPost.author.firstName} {selectedPost.author.lastName}</Tag>
                )}
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(selectedPost.createdAt).toLocaleDateString()}
                </Text>
              </Space>
            </div>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>{selectedPost.content}</Paragraph>
            <Descriptions bordered size="small" style={{ marginTop: 24 }} column={1}>
              <Descriptions.Item label="Post ID">{selectedPost.id}</Descriptions.Item>
              <Descriptions.Item label="Author ID">{selectedPost.authorUserId}</Descriptions.Item>
              <Descriptions.Item label="Created">{new Date(selectedPost.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Updated">{new Date(selectedPost.updatedAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 3 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Content" name="content" rules={[{ required: true }, { min: 10 }]}>
              <TextArea rows={8} />
            </Form.Item>
            <Form.Item label="Author" name="authorUserId" rules={[{ required: true }]}>
              <Select>
                {savedUsers.map((u) => (
                  <Select.Option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} — {u.email}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </AppLayout>
  )
}
