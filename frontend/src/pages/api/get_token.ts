"use server"
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const requestBody = JSON.stringify(req.body);
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const accessToken = cookies?.access
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || ""}`,
    }
    if (req.method === "GET"){
        res.status(200).json({ token: accessToken })
    }
}