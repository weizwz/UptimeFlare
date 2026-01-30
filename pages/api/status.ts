import { getFromStore } from '@/worker/src/store'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  const host = req.headers.get('host')
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')

  let isAllowed = (_url: string | null) => false

  if (host) {
    // Dynamically determine the root domain to allow
    // e.g. status.weizwz.com -> weizwz.com
    // e.g. weizwz.com -> weizwz.com
    // e.g. localhost:3000 -> localhost
    const parts = host.split(':')[0].split('.') // Remove port if present
    let rootDomain = host.split(':')[0]
    if (parts.length > 2 && !/^\d+\.\d+\.\d+\.\d+$/.test(rootDomain)) {
      rootDomain = parts.slice(1).join('.')
    }

    isAllowed = (url: string | null) => {
      if (!url) return false
      try {
        const urlObj = new URL(url)
        return urlObj.hostname === rootDomain || urlObj.hostname.endsWith('.' + rootDomain)
      } catch {
        return false
      }
    }
  }

  // Configure CORS headers for allowed origins
  const corsHeaders: Record<string, string> = {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=10, stale-while-revalidate=59',
  }

  if (origin && isAllowed(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin
    corsHeaders['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Block requests with Origin/Referer from unauthorized domains
  if (origin && !isAllowed(origin)) {
    return new Response('Forbidden: Origin not allowed', { status: 403 })
  }
  if (referer && !isAllowed(referer)) {
    // Optional: stricter referer check, but beware of privacy settings stripping referers
    return new Response('Forbidden: Referer not allowed', { status: 403 })
  }
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
