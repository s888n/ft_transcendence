import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchValue } = req.query
    const requestBody = JSON.stringify(req.body);
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const accessToken = cookies?.access
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || ""}`,
    }

    if (req.method === "GET") {
        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/search/${searchValue}`, {
            headers: headers,
        })

        if (response.status === 200) {
            const responseData = await response.json();
            res.status(200).json( responseData )
        } else
            res.status(response.status).json( response )
    }
}