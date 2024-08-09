"use server"
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { username } = req.query;

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const accessToken = cookies?.access
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || ""}`,
    }
    if (req.method === "GET") {
        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/get_user?username=${username}`, {
            headers: headers,
        })

        if (response.status === 200) {
            const responseData = await response.json();
            res.status(200).json(responseData )
        } else
            res.status(response.status).json( response )
    }
}