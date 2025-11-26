/* eslint-disable */
/**
 * Generated server types - run `npx convex dev` to regenerate
 */

import {
  GenericActionCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;

export type DatabaseReader = GenericDatabaseReader<DataModel>;
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;

export {
  query,
  internalQuery,
  mutation,
  internalMutation,
  action,
  internalAction,
  httpAction,
} from "convex/server";
