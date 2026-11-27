import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
 configuracoes:defineTable({key:v.string(),value:v.string()}).index("by_key",["key"]),
 pushSubscriptions:defineTable({endpoint:v.string(),keys:v.object({p256dh:v.string(),auth:v.string()}),createdAt:v.number()}).index("by_endpoint",["endpoint"]),
 confirmacoes:defineTable({eventDate:v.string(),name:v.string(),normalizedName:v.string(),createdAt:v.number(),cancellationToken:v.optional(v.string())}).index("by_eventDate",["eventDate"]).index("by_eventDate_and_normalizedName",["eventDate","normalizedName"]),
});
