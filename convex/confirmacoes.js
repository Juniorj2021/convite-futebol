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
    cancellationToken: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("confirmacoes")
      .withIndex("by_eventDate_and_normalizedName", (q) =>
        q.eq("eventDate", args.eventDate).eq("normalizedName", args.normalizedName),
      )
      .first();

    if (!existing || !existing.cancellationToken ||
        existing.cancellationToken !== args.cancellationToken) {
      return false;
    }

    await ctx.db.delete(existing._id);
    return true;
  },
});
