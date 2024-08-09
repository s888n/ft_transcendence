"use server"
import axios from 'axios';
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { code } = req.query
    const postData = JSON.stringify({
        'grant_type': 'authorization_code',
        'client_id': "u-s4t2ud-9267b3fde4ad5d8140083b81f05e9fc74057eee1d70a67f1c0cd53be79342610",
        'client_secret': "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",
        'code': code,
        'redirect_uri': 'http://127.0.0.1:3000/login/auth42',
    })

    if (req.method === "GET") {
        const response = await axios.post("https://api.intra.42.fr/oauth/token", postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            res.status(200).json({
                status: response.status,
                data: response.data,
                headers: response.headers
            })
        } else
            res.status(response.status).json({
                status: response.status,
                data: response.data
            })
    }
}