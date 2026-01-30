import { getFromStore } from '@/worker/src/store'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  try {
    const compactedStateStr = await getFromStore(process.env as any, 'state')
    return new Response(JSON.stringify({ compactedStateStr }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
