import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Search, Sparkles, Store } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

export function Products() {
  const stores = useQuery(api.stores.getMyStores);
  const [selectedStoreId, setSelectedStoreId] = useState<Id<"stores"> | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const products = useQuery(
    api.products.getByStore,
    selectedStoreId ? { storeId: selectedStoreId } : "skip"
  );

  const searchResults = useQuery(
    api.products.search,
    selectedStoreId && searchQuery
      ? { storeId: selectedStoreId, query: searchQuery }
      : "skip"
  );

  const displayProducts = searchQuery ? searchResults : products?.products;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          View and manage products from your connected stores
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedStoreId ?? undefined}
          onValueChange={(value) => setSelectedStoreId(value as Id<"stores">)}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {stores?.map((store) => (
              <SelectItem key={store._id} value={store._id}>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  {store.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedStoreId && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {!selectedStoreId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Select a store</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Choose a connected store to view its products
            </p>
          </CardContent>
        </Card>
      ) : !displayProducts?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              {searchQuery
                ? "Try a different search term"
                : "Sync your store to import products"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const mainImage = product.images?.[0]?.src;
  const isOptimized = !!product.lastOptimizedAt;

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {isOptimized && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Optimized
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
        {product.sku && (
          <CardDescription className="text-xs">
            SKU: {product.sku}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">${product.salePrice}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.regularPrice}
                </span>
              </div>
            ) : (
              <span className="font-semibold">
                {product.regularPrice ? `$${product.regularPrice}` : "N/A"}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
