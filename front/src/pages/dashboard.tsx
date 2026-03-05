import { Card, Row, Col, Statistic, Typography, Button } from 'antd';
import { UserOutlined, FileTextOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { fetchSavedUsers } from '../slices/usersSlice';
import { fetchPosts } from '../slices/postsSlice';

const { Title, Text } = Typography

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { savedUsers } = useAppSelector((state) => state.users);
  const { total } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchSavedUsers());
    dispatch(fetchPosts({ page: 1, limit: 1 }));
  }, [dispatch])

  return (
    <AppLayout>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Saved Users"
              value={savedUsers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              onClick={() => router.push('/users')}
              style={{ padding: 0, marginTop: 8 }}
            >
              View Users
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Posts"
              value={total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              onClick={() => router.push('/posts')}
              style={{ padding: 0, marginTop: 8 }}
            >
              View Posts
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24, borderRadius: 12 }}>
        <Title level={5}>Quick Actions</Title>
        <Row gutter={16}>
          <Col>
            <Button type="primary" onClick={() => router.push('/users')}>
              Browse Users
            </Button>
          </Col>
          <Col>
            <Button onClick={() => router.push('/posts')}>
              Manage Posts
            </Button>
          </Col>
        </Row>
      </Card>
    </AppLayout>
  )
}
