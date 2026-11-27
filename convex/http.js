import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

http.route({
  path: "/confirmacoes",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const eventDate = url.searchParams.get("eventDate");
    if (!validDate(eventDate)) return json({ error: "Data do evento inválida." }, 400);

    const participants = await ctx.runQuery(internal.confirmacoes.listForEvent, { eventDate });
    return json({ eventDate, total: participants.length, participants });
  }),
});

http.route({
  path: "/confirmacoes",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Envie um nome válido." }, 400);
    }

    const eventDate = body?.eventDate;
    const name = String(body?.name || "").trim().replace(/\s+/g, " ");
    if (!validDate(eventDate)) return json({ error: "Data do evento inválida." }, 400);
    if (name.length < 2 || name.length > 70) {
      return json({ error: "Informe seu nome (de 2 a 70 caracteres)." }, 400);
    }

    const normalizedName = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

    const result = await ctx.runMutation(internal.confirmacoes.addForEvent, {
      eventDate,
      name,
      normalizedName,
    });

    return json({
      ok: true,
      duplicate: result.duplicate,
      participant: result.participant,
    }, result.duplicate ? 409 : 200);
  }),
});

export default http;