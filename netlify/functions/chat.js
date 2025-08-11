// Netlify Function: proxies site requests to your private API
// Reads BACKEND_URL and BACKEND_API_KEY from Netlify environment variables.
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,OPTIONS" } };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const backend = process.env.BACKEND_URL;
    const apikey  = process.env.BACKEND_API_KEY;
    if (!backend || !apikey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing BACKEND_URL or BACKEND_API_KEY" }) };
    }
    const url = backend.replace(/\/$/, "") + "/chat";
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apikey },
      body: JSON.stringify(body)
    });
    const text = await r.text();
    return { statusCode: r.status, body: text, headers: { "Content-Type": "application/json" } };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
