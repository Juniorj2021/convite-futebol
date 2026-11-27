function eventDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const d = new Date(Date.UTC(+p.year, +p.month - 1, +p.day + 1, 12));
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(d);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export async function onRequest(context) {
  const { request } = context;
  const eventDate = eventDateKey();
  const baseUrl = "https://reminiscent-oyster-516.convex.site";
  const endpoint = `${baseUrl}/confirmacoes`;

  try {
    if (request.method === "GET") {
      const response = await fetch(`${endpoint}?eventDate=${encodeURIComponent(eventDate)}`, {
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      return json(data, response.status);
    }

    if (request.method === "POST" || request.method === "DELETE") {
      let body;
      try { body = await request.json(); } catch {
        return json({ error: "Envie dados válidos." }, 400);
      }

      const name = String(body?.name || "").trim().replace(/\s+/g, " ");
      if (name.length < 2 || name.length > 70) {
        return json({ error: "Informe seu nome (de 2 a 70 caracteres)." }, 400);
      }

      const payload = { ...body, eventDate, name };
      const response = await fetch(endpoint, {
        method: request.method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return json(data, response.status);
    }

    return json({ error: "Método não permitido." }, 405);
  } catch {
    return json({ error: "Não foi possível acessar o serviço de confirmações. Tente novamente." }, 502);
  }
}
