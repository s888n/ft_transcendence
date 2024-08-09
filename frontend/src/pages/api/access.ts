"use server"
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"
import { cookies } from 'next/headers'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const cookies = cookie.parse(req.headers.cookie ?? '');
  const access = cookies?.access_token
  
  if (access)
    res.status(200).send({ access_token: access })
}