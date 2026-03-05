import * as jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ // en este token se guarda la información que luego retorna al front
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      email: 'admin@gmail.com',
      username: 'pin0',
      test: 'test',
    }, 'secret');

    const serializedToken = serialize('myTokenName', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // cuando es para backend independientes se recomienda 'none'
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    res.setHeader('Set-Cookie', serializedToken);
    // return res.json('login sucessfully');
    return res.status(200).json({
      token,
      message: 'login sucessfully',
    });
  }

  return res.status(401).json({ error: 'Invalid user or password' });
}
