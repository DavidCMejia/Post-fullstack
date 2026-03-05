import { serialize } from 'cookie';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  const { myTokenName } = req.cookies;

  if (!myTokenName) {
    return res.status(401).json({ error: 'no token' });
  }

  try {
    verify(myTokenName, 'secret');
    const serializedToken = serialize('myTokenName', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // cuando es para backend independientes se recomienda 'none'
      maxAge: 0,
      path: '/',
    });
    res.setHeader('Set-Cookie', serializedToken);
    res.status(200).json({ message: 'logged out sucessfully' });
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
}
