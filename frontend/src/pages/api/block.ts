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
    if (req.method === "POST") {

        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/block`, {
            headers: headers,
            method: "POST",
            body: requestBody
        })

        if (response.status === 202) {
            const responseData = await response.json();
            res.status(202).json(responseData)
        } else
            res.status(response.status).json(response)

    }
}