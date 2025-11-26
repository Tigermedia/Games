import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get current user (requires authentication context)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

// Create or update user from Clerk webhook
export const createOrUpdate = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
      });
      return existing._id;
    }

    // Create new user with free plan
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      plan: "free",
      monthlyCredits: 10, // Free tier gets 10 product optimizations
      totalCreditsUsed: 0,
      createdAt: Date.now(),
      settings: {
        defaultAIProvider: "openai",
        defaultLanguage: "en",
        autoOptimize: false,
      },
    });
  },
});

// Update user settings
export const updateSettings = mutation({
  args: {
    defaultAIProvider: v.optional(
      v.union(v.literal("openai"), v.literal("claude"), v.literal("gemini"))
    ),
    defaultLanguage: v.optional(v.union(v.literal("en"), v.literal("he"))),
    autoOptimize: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const newSettings = { ...user.settings };
    if (args.defaultAIProvider !== undefined) {
      newSettings.defaultAIProvider = args.defaultAIProvider;
    }
    if (args.defaultLanguage !== undefined) {
      newSettings.defaultLanguage = args.defaultLanguage;
    }
    if (args.autoOptimize !== undefined) {
      newSettings.autoOptimize = args.autoOptimize;
    }

    await ctx.db.patch(user._id, { settings: newSettings });
    return user._id;
  },
});

// Get user usage stats
export const getUsageStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    // Get usage records for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageRecords = await ctx.db
      .query("usageRecords")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), startOfMonth.getTime()))
      .collect();

    const creditsUsedThisMonth = usageRecords.reduce(
      (sum, record) => sum + record.credits,
      0
    );

    return {
      plan: user.plan,
      monthlyCredits: user.monthlyCredits,
      creditsUsedThisMonth,
      creditsRemaining: user.monthlyCredits - creditsUsedThisMonth,
      totalCreditsUsed: user.totalCreditsUsed,
    };
  },
});
