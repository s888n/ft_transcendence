"use server"
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.setHeader('Set-Cookie', [
        cookie.serialize('access', '', {
            maxAge: -1,
            path: '/'
        }),
    ]);
    res.status(201).json({ status: 201, message: "Logged out successfully" });
}