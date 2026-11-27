function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=UTF-8", "Cache-Control": "no-store" } });
}
export async function onRequest(context) {
  const baseUrl = "https://grand-roadrunner-255.convex.site";
  try {
    if (context.request.method === "GET") {
      const eventDate = new URL(context.request.url).searchParams.get("eventDate");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate || "")) return json({ error: "Data do evento inválida." }, 400);
      const response = await fetch(baseUrl + "/horario?eventDate=" + encodeURIComponent(eventDate), { headers: { "Accept": "application/json" } });
      return json(await response.json(), response.status);
    }
    if (context.request.method === "POST") {
      let body;
      try { body = await context.request.json(); } catch { return json({ error: "Informe um horário válido." }, 400); }
      const response = await fetch(baseUrl + "/horario", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) });
      return json(await response.json(), response.status);
    }
    return json({ error: "Método não permitido." }, 405);
  } catch { return json({ error: "Não foi possível salvar o horário. Tente novamente." }, 502); }
}
