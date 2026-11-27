import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const get = internalQuery({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", "horario"))
      .first();
    return row?.value ?? "06:00";
  },
});

export const set = internalMutation({
  args: { time: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", "horario"))
      .first();
    if (row) await ctx.db.patch(row._id, { value: args.time });
    else await ctx.db.insert("configuracoes", { key: "horario", value: args.time });
    return null;
  },
});
