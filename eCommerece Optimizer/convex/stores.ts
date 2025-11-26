import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Get all stores for current user
export const getMyStores = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("stores")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get a single store by ID
export const getStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return null;
    }

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      return null;
    }

    return store;
  },
});

// Connect a WooCommerce store
export const connectWooCommerce = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    consumerKey: v.string(),
    consumerSecret: v.string(),
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

    // Check store limits based on plan
    const existingStores = await ctx.db
      .query("stores")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const storeLimit =
      user.plan === "free"
        ? 1
        : user.plan === "starter"
          ? 3
          : user.plan === "pro"
            ? 10
            : Infinity;

    if (existingStores.length >= storeLimit) {
      throw new Error(
        `Your ${user.plan} plan allows only ${storeLimit} store(s). Please upgrade to add more.`
      );
    }

    // Normalize URL (remove trailing slash)
    const normalizedUrl = args.url.replace(/\/$/, "");

    // Check if store with this URL already exists
    const existingStore = existingStores.find((s) => s.url === normalizedUrl);
    if (existingStore) {
      throw new Error("A store with this URL is already connected");
    }

    return await ctx.db.insert("stores", {
      userId: user._id,
      platform: "woocommerce",
      name: args.name,
      url: normalizedUrl,
      consumerKey: args.consumerKey,
      consumerSecret: args.consumerSecret,
      webhooksEnabled: false,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Update store settings
export const updateStore = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.optional(v.string()),
    consumerKey: v.optional(v.string()),
    consumerSecret: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      throw new Error("Not authorized");
    }

    const updates: Partial<typeof store> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.consumerKey !== undefined) updates.consumerKey = args.consumerKey;
    if (args.consumerSecret !== undefined)
      updates.consumerSecret = args.consumerSecret;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(args.storeId, updates);
    return args.storeId;
  },
});

// Delete a store
export const deleteStore = mutation({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      throw new Error("Not authorized");
    }

    // Delete all related products
    const products = await ctx.db
      .query("products")
      .withIndex("by_storeId", (q) => q.eq("storeId", args.storeId))
      .collect();

    for (const product of products) {
      await ctx.db.delete(product._id);
    }

    // Delete the store
    await ctx.db.delete(args.storeId);
    return true;
  },
});

// Update sync status (internal use)
export const updateSyncStatus = mutation({
  args: {
    storeId: v.id("stores"),
    lastSyncAt: v.optional(v.number()),
    syncError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: { lastSyncAt?: number; syncError?: string } = {};
    if (args.lastSyncAt !== undefined) updates.lastSyncAt = args.lastSyncAt;
    if (args.syncError !== undefined) updates.syncError = args.syncError;

    await ctx.db.patch(args.storeId, updates);
  },
});
