import { NextResponse } from 'next/server'

// Disabled until authenticated, isolated persistence is implemented.
function unavailable() {
  return NextResponse.json({ error: 'Not found' }, {
    status: 404, headers: { 'Cache-Control': 'no-store' },
  })
}

export async function GET() { return unavailable() }
export async function POST(_request: Request) { return unavailable() }
