// netlify/functions/chat.js
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.CAPROCK_API_KEY;       // must be set in Netlify
  const backend = process.env.BACKEND_URL || 'https://api.caprocktech.com';
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'CAPROCK_API_KEY missing' }) };
  }

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const resp = await fetch(`${backend}/chat`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();
  return {
    statusCode: resp.status,
    headers: { 'content-type': resp.headers.get('content-type') || 'application/json' },
    body: text,
  };
}
