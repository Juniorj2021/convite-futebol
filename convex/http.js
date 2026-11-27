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

function normalizeName(name) {
  return name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

http.route({
  path: "/horario",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const time = await ctx.runQuery(internal.horario.get, {});
    return json({ time });
  }),
});

http.route({
  path: "/horario",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body;
    try { body = await request.json(); } catch { return json({ error: "Informe um horário válido." }, 400); }
    const time = String(body?.time || "");
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return json({ error: "Horário inválido." }, 400);
    await ctx.runMutation(internal.horario.set, { time });
    return json({ ok: true, time });
  }),
});

http.route({
  path: "/local",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const location = await ctx.runQuery(internal.local.get, {});
    return json({ location });
  }),
});

http.route({
  path: "/local",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body;
    try { body = await request.json(); } catch { return json({ error: "Informe um local válido." }, 400); }
    const location = String(body?.location || "").trim().replace(/\\s+/g, " ");
    if (location.length < 2 || location.length > 100) return json({ error: "O local deve ter entre 2 e 100 caracteres." }, 400);
    await ctx.runMutation(internal.local.set, { location });
    return json({ ok: true, location });
  }),
});

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

    const cancellationToken = crypto.randomUUID();
    const result = await ctx.runMutation(internal.confirmacoes.addForEvent, {
      eventDate,
      name,
      normalizedName: normalizeName(name),
      cancellationToken,
    });

    if (result.duplicate) {
      return json({ error: "Este nome já confirmou presença.", duplicate: true }, 409);
    }

    return json({
      ok: true,
      eventDate,
      participant: result.participant,
      cancellationToken: result.cancellationToken,
    });
  }),
});

http.route({
  path: "/confirmacoes",
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Não foi possível validar o cancelamento." }, 400);
    }

    const eventDate = body?.eventDate;
    const name = String(body?.name || "").trim().replace(/\s+/g, " ");
    const cancellationToken = String(body?.cancellationToken || "");
    if (!validDate(eventDate) || name.length < 2) {
      return json({ error: "Dados de cancelamento inválidos." }, 400);
    }

    const cancelled = await ctx.runMutation(internal.confirmacoes.cancelForEvent, {
      eventDate,
      normalizedName: normalizeName(name),
      cancellationToken,
    });

    if (!cancelled) {
      return json({ error: "Não foi possível cancelar. Use o mesmo navegador em que confirmou presença." }, 403);
    }

    return json({ ok: true });
  }),
});

export default http;
