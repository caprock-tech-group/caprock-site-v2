// netlify/functions/chat.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.CAPROCK_API_KEY;
  const backend = (process.env.BACKEND_URL || "https://api.caprocktech.com").replace(/\/+$/,"");

  try {
    const { prompt, max_steps = 3, temperature = 0.2 } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing 'prompt'" }) };
    }

    const resp = await fetch(`${backend}/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ prompt, max_steps, temperature }),
    });

    const text = await resp.text(); // pass through whatever the API returns
    return {
      statusCode: resp.status,
      headers: { "content-type": "application/json" },
      body: text,
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
