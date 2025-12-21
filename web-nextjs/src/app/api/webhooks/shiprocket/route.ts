import { NextRequest } from 'next/server';

// Minimal webhook scaffold for Shiprocket.
// It logs incoming events and returns a simple 200 response.
// Extend this to verify signatures and persist events in production.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Log the incoming webhook so developers can inspect the payload
    console.log('[shiprocket webhook] received:', JSON.stringify(body));

    // TODO: verify signature / authenticity here
    // TODO: persist the event to your storage adapter (DynamoDB / RDS)

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[shiprocket webhook] error parsing body', err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 400 });
  }
}

export const GET = async () => new Response('Shiprocket webhook endpoint (POST only)', { status: 200 });
