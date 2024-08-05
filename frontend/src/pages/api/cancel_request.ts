"use server"
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'


// type ResponseData = {
//     token?: string,
// }

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
    // console.log("bearer", cookies, accessToken, requestBody)
    if (req.method === "POST") {

        const response = await fetch("http://127.0.0.1:8000/api/cancel_request", {
            headers: headers,
            method: "POST",
            body: requestBody
        })

        if (response.status === 202) {
            const responseData = await response.json();
            // console.log(response, responseData)
            res.status(202).json(responseData)
        } else
            res.status(response.status).json(response)

    }
}