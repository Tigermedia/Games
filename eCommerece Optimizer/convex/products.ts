import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Get products for a store
export const getByStore = query({
  args: {
    storeId: v.id("stores"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { products: [], nextCursor: null };
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return { products: [], nextCursor: null };
    }

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      return { products: [], nextCursor: null };
    }

    const limit = args.limit ?? 20;
    const products = await ctx.db
      .query("products")
      .withIndex("by_storeId", (q) => q.eq("storeId", args.storeId))
      .take(limit + 1);

    const hasMore = products.length > limit;
    const returnProducts = hasMore ? products.slice(0, -1) : products;

    return {
      products: returnProducts,
      nextCursor: hasMore ? returnProducts[returnProducts.length - 1]._id : null,
    };
  },
});

// Get a single product by ID
export const getProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      return null;
    }

    // Verify ownership through store
    const store = await ctx.db.get(product.storeId);
    if (!store) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      return null;
    }

    return product;
  },
});

// Search products
export const search = query({
  args: {
    storeId: v.id("stores"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      return [];
    }

    const limit = args.limit ?? 20;
    const searchQuery = args.query.toLowerCase();

    // Simple search - in production, consider using a search index
    const products = await ctx.db
      .query("products")
      .withIndex("by_storeId", (q) => q.eq("storeId", args.storeId))
      .collect();

    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.sku?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit);
  },
});

// Upsert product from WooCommerce sync
export const upsertFromSync = mutation({
  args: {
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
    syncChecksum: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if product already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_externalId", (q) =>
        q.eq("storeId", args.storeId).eq("externalId", args.externalId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update if checksum changed
      if (existing.syncChecksum !== args.syncChecksum) {
        await ctx.db.patch(existing._id, {
          sku: args.sku,
          name: args.name,
          description: args.description,
          shortDescription: args.shortDescription,
          images: args.images,
          regularPrice: args.regularPrice,
          salePrice: args.salePrice,
          categories: args.categories,
          tags: args.tags,
          status: args.status,
          syncChecksum: args.syncChecksum,
          lastSyncAt: now,
        });
      }
      return existing._id;
    }

    // Create new product
    return await ctx.db.insert("products", {
      storeId: args.storeId,
      userId: args.userId,
      externalId: args.externalId,
      sku: args.sku,
      name: args.name,
      description: args.description,
      shortDescription: args.shortDescription,
      images: args.images,
      regularPrice: args.regularPrice,
      salePrice: args.salePrice,
      categories: args.categories,
      tags: args.tags,
      status: args.status,
      lastSyncAt: now,
      syncChecksum: args.syncChecksum,
    });
  },
});

// Update product optimization status
export const updateOptimizationStatus = mutation({
  args: {
    productId: v.id("products"),
    lastOptimizedAt: v.number(),
    optimizationScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, {
      lastOptimizedAt: args.lastOptimizedAt,
      optimizationScore: args.optimizationScore,
    });
  },
});

// Get products that need optimization
export const getNeedingOptimization = query({
  args: {
    storeId: v.id("stores"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || store.userId !== user._id) {
      return [];
    }

    const limit = args.limit ?? 10;

    // Get products that have never been optimized
    const products = await ctx.db
      .query("products")
      .withIndex("by_storeId", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.eq(q.field("lastOptimizedAt"), undefined))
      .take(limit);

    return products;
  },
});

// Get product stats for dashboard
export const getStats = query({
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

    const products = await ctx.db
      .query("products")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const totalProducts = products.length;
    const optimizedProducts = products.filter(
      (p) => p.lastOptimizedAt !== undefined
    ).length;
    const pendingOptimization = totalProducts - optimizedProducts;

    return {
      totalProducts,
      optimizedProducts,
      pendingOptimization,
      optimizationRate:
        totalProducts > 0
          ? Math.round((optimizedProducts / totalProducts) * 100)
          : 0,
    };
  },
});
