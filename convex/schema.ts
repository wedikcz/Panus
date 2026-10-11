import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const schema = defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("operator")),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("disabled")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    otpSecret: v.optional(v.string()),
  }).index("by_email", ["email"]).index("by_role", ["role"]),

  auditLogs: defineTable({
    action: v.string(),
    actorId: v.string(),
    actorRole: v.union(v.literal("admin"), v.literal("operator")),
    intent: v.string(),
    summary: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_actor", ["actorId"]).index("by_created_at", ["createdAt"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("blocked"),
    ),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("critical")),
    parentId: v.optional(v.id("tasks")),
    owner: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    attemptCount: v.number(),
    result: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]).index("by_parent", ["parentId"]).index("by_owner", ["owner"]),

  taskDependencies: defineTable({
    taskId: v.id("tasks"),
    dependsOn: v.id("tasks"),
    createdAt: v.number(),
  }).index("by_task", ["taskId"]).index("by_dependency", ["dependsOn"]),

  files: defineTable({
    path: v.string(),
    content: v.string(),
    kind: v.union(v.literal("file"), v.literal("directory")),
    mimeType: v.optional(v.string()),
    checksum: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_path", ["path"]).index("by_kind", ["kind"]),

  models: defineTable({
    modelId: v.string(),
    name: v.string(),
    family: v.string(),
    tier: v.union(v.literal("tiny"), v.literal("balanced"), v.literal("pro")),
    preferredFor: v.string(),
    quantization: v.optional(v.string()),
    isDefault: v.boolean(),
    downloadProgress: v.number(),
    status: v.union(v.literal("idle"), v.literal("downloading"), v.literal("ready"), v.literal("error")),
    vramaHint: v.optional(v.string()),
    metadata: v.optional(v.any()),
    updatedAt: v.number(),
  }).index("by_model_id", ["modelId"]).index("by_status", ["status"]),

  sessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    summary: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),

  sessionEvents: defineTable({
    sessionId: v.id("sessions"),
    type: v.string(),
    actor: v.string(),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]).index("by_type", ["type"]),

  approvals: defineTable({
    taskId: v.id("tasks"),
    requestedBy: v.string(),
    approvedBy: v.optional(v.string()),
    decision: v.optional(v.union(v.literal("approved"), v.literal("rejected"))),
    reason: v.optional(v.string()),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  }).index("by_task", ["taskId"]).index("by_decision", ["decision"]),
});

export type UserRole = "admin" | "operator";
export type TaskStatus = "pending" | "running" | "success" | "failed" | "blocked";
export type TaskPriority = "low" | "normal" | "high" | "critical";
export type ModelTier = "tiny" | "balanced" | "pro";

export type Schema = typeof schema;
