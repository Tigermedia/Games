/* eslint-disable */
/**
 * Generated data model types - run `npx convex dev` to regenerate
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type { DocumentByName, TableNamesInDataModel } from "convex/server";
import schema from "../schema.js";

export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

export type Doc<TableName extends TableNamesInDataModel<DataModel>> =
  DocumentByName<DataModel, TableName>;

export type Id<TableName extends TableNamesInDataModel<DataModel>> =
  DocumentByName<DataModel, TableName>["_id"];
