import { NextRequest, NextResponse } from 'next/server'

// Backend API URL - using existing Medusa backend URL
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request
    const searchParams = request.nextUrl.searchParams
    
    // Build the backend URL
    const backendURL = `${BACKEND_URL}/store/search?${searchParams.toString()}`
    
    // Forward the request to the backend
    const response = await fetch(backendURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add required publishable key
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        // Forward any authentication headers if needed
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      }
    })

    if (!response.ok) {
      console.error('Backend search API error:', response.status, response.statusText)
      
      // Return empty results instead of error to prevent frontend crashes
      return NextResponse.json({
        products: [],
        facets: {},
        pagination: {
          page: 1,
          limit: 20,
          total_pages: 0
        },
        total: 0,
        processing_time: 0
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Search proxy error:', error)
    
    // Return empty results on error
    return NextResponse.json({
      products: [],
      facets: {},
      pagination: {
        page: 1,
        limit: 20,
        total_pages: 0
      },
      total: 0,
      processing_time: 0,
      error: 'Search temporarily unavailable'
    })
  }
} 