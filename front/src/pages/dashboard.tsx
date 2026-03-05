import {
  Button,
} from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const router = useRouter();

  const getProfile = async () => {
    const res = await axios.get('api/profile');
    setUser(res.data.user);
    console.log('🚀 ~ user:', user);
  };

  const logout = async () => {
    await axios.post('api/auth/logout'); // hay una validación en el backend q en caso de que el cookie no este, da error 401 unathorized que
    // en otras palabras quiere decir que no esta logueado y esta intentando hacer logout
    router.push('/');
  };
  return (
    <>
      <h1>Dashboard</h1>
      <Button onClick={() => getProfile()}>Get Profile</Button>
      <Button onClick={() => logout()}>Logout</Button>
      <pre>
        Usuario:
        {' '}
        {JSON.stringify(user, null, 2)}
      </pre>
    </>
  );
}
