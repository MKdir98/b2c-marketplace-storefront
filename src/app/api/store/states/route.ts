import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const backendURL = `${BACKEND_URL}/store/states?${searchParams.toString()}`

    const response = await fetch(backendURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      }
    })

    if (!response.ok) {
      console.error('Backend states API error:', response.status, response.statusText)
      return NextResponse.json({ states: [] }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('States proxy error:', error)
    return NextResponse.json({ states: [] }, { status: 500 })
  }
} 