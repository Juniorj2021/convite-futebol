import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const get = internalQuery({
  args: { eventDate: v.string() },
  returns: v.string(),
  handler: async (ctx) => {
    const key = "horario:" + args.eventDate;
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    const day = new Date(args.eventDate + "T12:00:00Z").getUTCDay();
    return row?.value ?? (day === 4 ? "19:00" : "06:00");
  },
});

export const set = internalMutation({
  args: { time: v.string(), eventDate: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const key = "horario:" + args.eventDate;
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (row) await ctx.db.patch(row._id, { value: args.time });
    else await ctx.db.insert("configuracoes", { key, value: args.time });
    return null;
  },
});
