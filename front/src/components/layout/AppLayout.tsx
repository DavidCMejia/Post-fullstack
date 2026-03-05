import { Layout, Menu, Button, Typography, Avatar } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { clearCredentials } from '../../slices/authSlice';

const { Sider, Header, Content } = Layout
const { Text } = Typography

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      dispatch(clearCredentials());
      router.push('/');
    }
  }

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/posts', icon: <FileTextOutlined />, label: 'Posts' },
    { key: '/docs', icon: <ApiOutlined />, label: 'API Docs' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="dark"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #303030' }}>
          <Text strong style={{ color: '#fff', fontSize: 16 }}>
            Users & Posts
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ marginTop: 8 }}
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px', borderTop: '1px solid #303030' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text style={{ color: '#aaa', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email ?? 'Admin'}
            </Text>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            size="small"
            style={{ background: 'transparent', color: '#aaa', border: '1px solid #303030' }}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>
            {menuItems.find((i) => i.key === router.pathname)?.label ?? 'Portal'}
          </Text>
        </Header>
        <Content style={{ margin: '24px', minHeight: 'calc(100vh - 112px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
