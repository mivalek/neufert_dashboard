import { type NextRequest } from 'next/server'

export async function GET(req: Request) {
    return Response.json({result: "asfdsf!"})
}

export async function POST(req: NextRequest) {
    const { id } = await req.json()
    if (!id) return Response.json({ status: 400 })
    return Response.json({result: "success!", data: id})
}