import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")
    const rawResp = await fetch('http://localhost:' + process.env.SERVER_PORT + '/api/v1/prediction/' + id);
    const response = await rawResp.json();
    return Response.json({success: true, data: response.data})
}