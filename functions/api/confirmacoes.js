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
  const { request, env } = context;
  if (!env.CONVEX_SITE_URL) {
    return json({ error: "A conexão com o Convex ainda não foi configurada no Cloudflare Pages." }, 503);
  }

  const eventDate = eventDateKey();
  const baseUrl = env.CONVEX_SITE_URL.replace(/\/$/, "");
  const endpoint = `${baseUrl}/confirmacoes`;

  try {
    if (request.method === "GET") {
      const response = await fetch(`${endpoint}?eventDate=${encodeURIComponent(eventDate)}`, {
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      return json(data, response.status);
    }

    if (request.method === "POST") {
      let body;
      try { body = await request.json(); } catch {
        return json({ error: "Envie um nome válido." }, 400);
      }
      const name = String(body?.name || "").trim().replace(/\s+/g, " ");
      if (name.length < 2 || name.length > 70) {
        return json({ error: "Informe seu nome (de 2 a 70 caracteres)." }, 400);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ eventDate, name }),
      });
      const data = await response.json();
      return json(data, response.status);
    }

    return json({ error: "Método não permitido." }, 405);
  } catch {
    return json({ error: "Não foi possível acessar o serviço de confirmações. Tente novamente." }, 502);
  }
}
