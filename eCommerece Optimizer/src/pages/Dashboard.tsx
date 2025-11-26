import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Store, Sparkles, TrendingUp } from "lucide-react";

export function Dashboard() {
  const stats = useQuery(api.products.getStats);
  const usage = useQuery(api.users.getUsageStats);
  const stores = useQuery(api.stores.getMyStores);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your eCommerce optimization activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Stores
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              WooCommerce & Shopify
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProducts ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Optimized Products
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.optimizedProducts ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.optimizationRate ?? 0}% optimization rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credits Remaining
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.creditsRemaining ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {usage?.plan ?? "free"} plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to start optimizing your products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Connect your store</p>
                  <p className="text-sm text-muted-foreground">
                    Add your WooCommerce or Shopify store credentials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Sync your products</p>
                  <p className="text-sm text-muted-foreground">
                    Import products from your connected store
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Optimize with AI</p>
                  <p className="text-sm text-muted-foreground">
                    Enhance images and content to improve CTR
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Optimizations</CardTitle>
            <CardDescription>
              Products that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.pendingOptimization ? (
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-primary">
                  {stats.pendingOptimization}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  products waiting to be optimized
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products to optimize</p>
                <p className="text-sm">Connect a store to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
