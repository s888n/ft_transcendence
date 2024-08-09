"use server"
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"
import { cookies } from 'next/headers'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader('Set-Cookie', [
    cookie.serialize(
      'access', "access example", {
      httpOnly: false,
      secure: false, // Adjust based on your environment
      sameSite: 'strict',
      path: '/', // Ensure cookies are accessible across routes
    }),
    cookie.serialize(
      'refresh', "refresh example", {
      httpOnly: false,
      secure: false, // Adjust based on your environment
      sameSite: 'strict',
      path: '/', // Ensure cookies are accessible across routes
    })
  ]);
  const cookies = cookie.parse(req.headers.cookie ?? '');
  res.status(200).json({ message: 'Hello from Next.js!' })
}