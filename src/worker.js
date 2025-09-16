export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // အရင်ဆုံး API key တွေကို env ထဲက ယူ
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    const ZAI_API_KEY = env.ZAI_API_KEY;

    // Request body parse
    let body = {};
    try {
      if (request.method === "POST") {
        body = await request.json();
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Example endpoint route check
    if (url.pathname === "/gemini") {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/zai") {
      const response = await fetch("https://api.zai.com/v1/endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ZAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Worker is running but endpoint not found", {
      status: 404,
    });
  },
};
