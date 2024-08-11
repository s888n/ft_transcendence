"use server"
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const requestBody = JSON.stringify(req.body);
    const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/intra`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: requestBody,
        credentials: "include"
    })
    if (response.status === 201) {
        const responseData = await response.json();
        res.setHeader('Set-Cookie', [
            cookie.serialize(
                'access', responseData.access, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60 * 24,
                sameSite: 'strict',
                path: '/'
            }
            ),
            // cookie.serialize(
            //     'refresh', responseData.refresh, {
            //     httpOnly: true,
            //     secure: false,
            //     maxAge: 60 * 60 * 24,
            //     sameSite: 'strict',
            //     path: '/'
            // }
            // )
        ]);
        res.status(201).json( responseData )
    } else {
        res.status(response.status).json( response )
    }
}