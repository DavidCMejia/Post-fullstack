import axios from 'axios';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/auth/login`,
      { email, password }
    );

    // Store token in httpOnly cookie
    const serializedToken = serialize('myTokenName', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    res.setHeader('Set-Cookie', serializedToken);
    return res.status(200).json({ token: data.token, message: 'Login successful' });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.error ?? 'Login failed';
    return res.status(status).json({ error: message })
  }
}
