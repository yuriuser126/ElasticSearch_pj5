// CORS 우회를 위한 프록시 API (App Router 방식) - 중계 구조화

import { NextRequest, NextResponse } from 'next/server'

//route.ts는 GET, POST 등 메서드 단위로 export를 작성해야 하므로, GET()으로 작성.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(targetUrl)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Proxy Error]', error)
    return NextResponse.json({ error: 'Failed to fetch from external API' }, { status: 500 })
  }
}
