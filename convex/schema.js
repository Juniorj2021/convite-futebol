import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  configuracoes: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
  confirmacoes: defineTable({
    eventDate: v.string(),
    name: v.string(),
    normalizedName: v.string(),
    createdAt: v.number(),
    cancellationToken: v.optional(v.string()),
  })
    .index("by_eventDate", ["eventDate"])
    .index("by_eventDate_and_normalizedName", ["eventDate", "normalizedName"]),
});
