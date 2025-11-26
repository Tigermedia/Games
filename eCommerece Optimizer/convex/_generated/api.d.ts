/* eslint-disable */
/**
 * Generated API types - run `npx convex dev` to regenerate
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as products from "../products.js";
import type * as stores from "../stores.js";
import type * as users from "../users.js";

declare const fullApi: ApiFromModules<{
  products: typeof products;
  stores: typeof stores;
  users: typeof users;
}>;

export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;
