import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  confirmacoes: defineTable({
    eventDate: v.string(),
    name: v.string(),
    normalizedName: v.string(),
    createdAt: v.number(),
  })
    .index("by_eventDate", ["eventDate"])
    .index("by_eventDate_and_normalizedName", ["eventDate", "normalizedName"]),
});