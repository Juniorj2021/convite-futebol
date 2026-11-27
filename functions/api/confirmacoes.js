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
  if (!env.CONFIRMACOES) {
    return json({ error: "Armazenamento ainda não configurado. O administrador precisa concluir a configuração do Cloudflare." }, 503);
  }

  const eventDate = eventDateKey();
  const prefix = `futebol:${eventDate}:`;

  if (request.method === "GET") {
    const names = [];
    let cursor;
    do {
      const page = await env.CONFIRMACOES.list({ prefix, cursor, limit: 1000 });
      const rows = await Promise.all(page.keys.map(async key => {
        const value = await env.CONFIRMACOES.get(key.name, "json");
        return value && typeof value.name === "string" ? value : null;
      }));
      names.push(...rows.filter(Boolean));
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    names.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return json({ eventDate, total: names.length, participants: names });
  }

  if (request.method === "POST") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "Envie um nome válido." }, 400); }
    const name = String(body?.name || "").trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > 70) {
      return json({ error: "Informe seu nome (de 2 a 70 caracteres)." }, 400);
    }

    const id = crypto.randomUUID();
    const record = { name, createdAt: new Date().toISOString() };
    await env.CONFIRMACOES.put(prefix + id, JSON.stringify(record));
    return json({ ok: true, participant: record });
  }

  return json({ error: "Método não permitido." }, 405);
}
