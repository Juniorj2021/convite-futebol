import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const get = internalQuery({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", "local"))
      .first();
    return row?.value ?? "Campo do Corujão";
  },
});

export const set = internalMutation({
  args: { location: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.query("configuracoes")
      .withIndex("by_key", (q) => q.eq("key", "local"))
      .first();
    if (row) await ctx.db.patch(row._id, { value: args.location });
    else await ctx.db.insert("configuracoes", { key: "local", value: args.location });
    return null;
  },
});
