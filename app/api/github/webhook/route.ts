import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import crypto from 'crypto'

function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret)
    const digest = 'sha256=' + hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

const RELEVANT_EVENTS = new Set(['repository', 'push', 'create', 'delete'])

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') ?? ''
  const event = req.headers.get('x-github-event') ?? ''
  const secret = process.env.GITHUB_WEBHOOK_SECRET

  if (secret) {
    if (!signature || !verifySignature(body, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  if (RELEVANT_EVENTS.has(event)) {
    revalidateTag('github-repos')
  }

  return NextResponse.json({ ok: true })
}
