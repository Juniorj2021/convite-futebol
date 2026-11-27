import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const listForEvent = internalQuery({
  args: { eventDate: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("confirmacoes"),
      name: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("confirmacoes")
      .withIndex("by_eventDate", (q) => q.eq("eventDate", args.eventDate))
      .order("asc")
      .take(500);

    return rows
      .map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  },
});

export const addForEvent = internalMutation({
  args: {
    eventDate: v.string(),
    name: v.string(),
    normalizedName: v.string(),
    cancellationToken: v.string(),
  },
  returns: v.object({
    duplicate: v.boolean(),
    participant: v.object({
      name: v.string(),
      createdAt: v.number(),
    }),
    cancellationToken: v.string(),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("confirmacoes")
      .withIndex("by_eventDate_and_normalizedName", (q) =>
        q.eq("eventDate", args.eventDate).eq("normalizedName", args.normalizedName),
      )
      .first();

    if (existing) {
      return {
        duplicate: true,
        participant: { name: existing.name, createdAt: existing.createdAt },
        cancellationToken: "",
      };
    }

    const createdAt = Date.now();
    await ctx.db.insert("confirmacoes", {
      eventDate: args.eventDate,
      name: args.name,
      normalizedName: args.normalizedName,
      createdAt,
      cancellationToken: args.cancellationToken,
    });

    return {
      duplicate: false,
      participant: { name: args.name, createdAt },
      cancellationToken: args.cancellationToken,
    };
  },
});

export const cancelForEvent = internalMutation({
  args: {
    eventDate: v.string(),
    normalizedName: v.string(),
    cancellationToken: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("confirmacoes")
      .withIndex("by_eventDate_and_normalizedName", (q) =>
        q.eq("eventDate", args.eventDate).eq("normalizedName", args.normalizedName),
      )
      .first();

    if (!existing) return false;
    // Registros antigos, criados antes do código privado, podem ser removidos pelo nome.
    // Registros novos continuam protegidos pelo código salvo no navegador de quem confirmou.
    if (existing.cancellationToken && existing.cancellationToken !== args.cancellationToken) return false;

    await ctx.db.delete(existing._id);
    return true;
  },
});


export const removeExpired = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const setting = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", "horario"))
      .first();
    const time = setting?.value ?? "06:00";
    const rows = await ctx.db.query("confirmacoes").take(1000);
    let removed = 0;
    for (const row of rows) {
      // A lista fica disponível durante o evento e por mais 5 horas após o horário programado.
      const eventStart = new Date(row.eventDate + "T" + time + ":00-03:00").getTime();
      if (Number.isFinite(eventStart) && now >= eventStart + 5 * 60 * 60 * 1000) {
        await ctx.db.delete(row._id);
        removed++;
      }
    }
    return removed;
  },
});

export const removeMiroOnce = internalMutation({
  args: { eventDate: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("confirmacoes")
      .withIndex("by_eventDate_and_normalizedName", (q) =>
        q.eq("eventDate", args.eventDate).eq("normalizedName", "miro"),
      )
      .take(10);
    for (const row of rows) await ctx.db.delete(row._id);
    return rows.length;
  },
});
