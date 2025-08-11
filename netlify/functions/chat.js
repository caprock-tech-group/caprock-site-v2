// Netlify Function: /.netlify/functions/chat
// Forwards requests to your backend with a Caprock persona prompt.

const ALLOWED_ORIGINS = [
  "https://caprocktech.com",
  "https://www.caprocktech.com",
];

function corsHeaders(event) {
  const origin = event.headers?.origin || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };
}

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(event), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const CAPROCK_API_KEY = process.env.CAPROCK_API_KEY;
  const BACKEND_URL = process.env.BACKEND_URL; // e.g. https://api.caprocktech.com

  if (!CAPROCK_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "CAPROCK_API_KEY missing" }),
    };
  }
  if (!BACKEND_URL) {
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "BACKEND_URL missing" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // ---- Caprock persona (system prompt) ----
  const SYSTEM = `
You are Caprock Technology Group’s virtual agent (Caprock Tech).
Voice: professional, concise, Texas-friendly, confident.
Operate like an MSP: proactive, security-first, clear communication.

Company facts (use exactly as written):
• Name: Caprock Technology Group (Caprock Tech)
• Region: Amarillo, Texas Panhandle
• Phone: (806) 316-5070
• Email: info@caprocktech.com
• Services: Managed IT (Core/Plus/Elite), Network HaaS (TP-Link Omada)
• Approach: MFA, EDR, patching, backups, QBRs; fast acknowledgment & updates.

Rules:
- Don’t invent facts; ask a clarifying question when needed.
- Never reveal keys, admin details, or internal infrastructure.
- Prefer action: offer a consult, call, or next step at the end.
`.trim();

  const userPrompt = String(body.prompt || "").trim();
  if (!userPrompt) {
    return {
      statusCode: 400,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Missing 'prompt'" }),
    };
  }

  const max_steps = typeof body.max_steps === "number" ? body.max_steps : 3;
  const temperature =
    typeof body.temperature === "number" ? body.temperature : 0.2;

  const combinedPrompt = `${SYSTEM}\n\nUser: ${userPrompt}\nAgent:`;

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": CAPROCK_API_KEY,
      },
      body: JSON.stringify({
        prompt: combinedPrompt,
        max_steps,
        temperature,
      }),
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: {
        ...corsHeaders(event),
        "content-type": "application/json",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Upstream error" }),
    };
  }
}
