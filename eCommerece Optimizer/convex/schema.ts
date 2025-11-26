import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    clerkId: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    monthlyCredits: v.number(),
    totalCreditsUsed: v.number(),
    createdAt: v.number(),
    settings: v.object({
      defaultAIProvider: v.union(
        v.literal("openai"),
        v.literal("claude"),
        v.literal("gemini")
      ),
      defaultLanguage: v.union(v.literal("en"), v.literal("he")),
      autoOptimize: v.boolean(),
    }),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // Store connections (WooCommerce, Shopify)
  stores: defineTable({
    userId: v.id("users"),
    platform: v.union(v.literal("woocommerce"), v.literal("shopify")),
    name: v.string(),
    url: v.string(),
    consumerKey: v.optional(v.string()),
    consumerSecret: v.optional(v.string()),
    shopifyAccessToken: v.optional(v.string()),
    webhookSecret: v.optional(v.string()),
    webhooksEnabled: v.boolean(),
    isActive: v.boolean(),
    lastSyncAt: v.optional(v.number()),
    syncError: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Synced products from stores
  products: defineTable({
    storeId: v.id("stores"),
    userId: v.id("users"),
    externalId: v.string(),
    sku: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    images: v.array(
      v.object({
        id: v.optional(v.string()),
        src: v.string(),
        alt: v.optional(v.string()),
        position: v.optional(v.number()),
      })
    ),
    regularPrice: v.optional(v.string()),
    salePrice: v.optional(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("publish"),
      v.literal("draft"),
      v.literal("pending")
    ),
    lastOptimizedAt: v.optional(v.number()),
    optimizationScore: v.optional(v.number()),
    lastSyncAt: v.number(),
    syncChecksum: v.string(),
  })
    .index("by_storeId", ["storeId"])
    .index("by_userId", ["userId"])
    .index("by_externalId", ["storeId", "externalId"]),

  // Optimization jobs
  optimizationJobs: defineTable({
    userId: v.id("users"),
    storeId: v.id("stores"),
    productId: v.id("products"),
    type: v.union(
      v.literal("image_background_removal"),
      v.literal("image_enhancement"),
      v.literal("image_resize"),
      v.literal("image_lifestyle"),
      v.literal("content_title"),
      v.literal("content_description"),
      v.literal("content_seo"),
      v.literal("full_optimization")
    ),
    mode: v.union(
      v.literal("realtime"),
      v.literal("batch"),
      v.literal("scheduled")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    input: v.object({
      imageUrl: v.optional(v.string()),
      originalTitle: v.optional(v.string()),
      originalDescription: v.optional(v.string()),
      language: v.optional(v.string()),
      aiProvider: v.optional(v.string()),
      options: v.optional(v.any()),
    }),
    output: v.optional(
      v.object({
        optimizedImageUrl: v.optional(v.string()),
        optimizedImageStorageId: v.optional(v.id("_storage")),
        optimizedTitle: v.optional(v.string()),
        optimizedDescription: v.optional(v.string()),
        seoKeywords: v.optional(v.array(v.string())),
        metadata: v.optional(v.any()),
      })
    ),
    error: v.optional(v.string()),
    retryCount: v.number(),
    creditsUsed: v.number(),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_productId", ["productId"])
    .index("by_status", ["status"]),

  // Optimization history
  optimizationHistory: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    jobId: v.id("optimizationJobs"),
    before: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      images: v.optional(v.array(v.string())),
    }),
    after: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      images: v.optional(v.array(v.string())),
    }),
    appliedToStore: v.boolean(),
    appliedAt: v.optional(v.number()),
    rolledBack: v.boolean(),
    rolledBackAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_productId", ["productId"]),

  // Usage and billing
  usageRecords: defineTable({
    userId: v.id("users"),
    jobId: v.optional(v.id("optimizationJobs")),
    type: v.union(
      v.literal("image_optimization"),
      v.literal("content_optimization"),
      v.literal("api_call")
    ),
    credits: v.number(),
    description: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Scheduled optimization rules
  schedules: defineTable({
    userId: v.id("users"),
    storeId: v.id("stores"),
    name: v.string(),
    cronExpression: v.string(),
    timezone: v.string(),
    optimizationTypes: v.array(v.string()),
    productFilter: v.optional(
      v.object({
        categories: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        olderThan: v.optional(v.number()),
      })
    ),
    isActive: v.boolean(),
    lastRunAt: v.optional(v.number()),
    nextRunAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_storeId", ["storeId"]),

  // Webhook events
  webhookEvents: defineTable({
    storeId: v.id("stores"),
    eventType: v.string(),
    payload: v.any(),
    processed: v.boolean(),
    processedAt: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_storeId", ["storeId"]),
});
