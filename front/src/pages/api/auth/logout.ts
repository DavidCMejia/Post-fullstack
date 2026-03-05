import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const cookie = req.cookies['myTokenName'];
  if (!cookie) return res.status(401).json({ error: 'Unauthorized' });

  res.setHeader('Set-Cookie', serialize('myTokenName', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  }));

  return res.status(200).json({ message: 'Logged out successfully' })
}
