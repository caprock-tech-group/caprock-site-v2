// netlify/functions/chat.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const apiKey = process.env.CAPROCK_API_KEY; // set in Netlify env
    if (!apiKey) {
      return { statusCode: 500, body: "Missing CAPROCK_API_KEY" };
    }

    const body = JSON.parse(event.body || "{}");
    const payload = {
      prompt: body.prompt ?? "",
      max_steps: body.max_steps ?? 3,
      temperature: body.temperature ?? 0.3,
    };

    const r = await fetch("https://api.caprocktech.com/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "content-type": r.headers.get("content-type") || "application/json" },
      body: text,
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
