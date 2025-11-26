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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ImageIcon,
  Type,
  Sparkles,
  Store,
  Wand2,
  Eraser,
  SunMedium,
  Crop,
  Camera,
} from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

export function Optimize() {
  const stores = useQuery(api.stores.getMyStores);
  const [selectedStoreId, setSelectedStoreId] = useState<Id<"stores"> | null>(
    null
  );

  const productsNeedingOptimization = useQuery(
    api.products.getNeedingOptimization,
    selectedStoreId ? { storeId: selectedStoreId, limit: 10 } : "skip"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Optimize</h1>
        <p className="text-muted-foreground">
          Enhance your product images and content with AI
        </p>
      </div>

      {/* Store Selector */}
      <Select
        value={selectedStoreId ?? undefined}
        onValueChange={(value) => setSelectedStoreId(value as Id<"stores">)}
      >
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select a store to optimize" />
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

      {!selectedStoreId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Select a store</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Choose a store to start optimizing its products
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image Optimization
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <OptimizationCard
                icon={Eraser}
                title="Background Removal"
                description="Remove or replace product backgrounds"
                credits={2}
              />
              <OptimizationCard
                icon={SunMedium}
                title="Image Enhancement"
                description="Improve lighting, colors, and sharpness"
                credits={2}
              />
              <OptimizationCard
                icon={Crop}
                title="Resize & Crop"
                description="Optimize for different platforms"
                credits={1}
              />
              <OptimizationCard
                icon={Camera}
                title="Lifestyle Images"
                description="Generate context images with AI"
                credits={5}
              />
            </div>

            {productsNeedingOptimization &&
            productsNeedingOptimization.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Products Needing Image Optimization</CardTitle>
                  <CardDescription>
                    {productsNeedingOptimization.length} products waiting for
                    optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productsNeedingOptimization.slice(0, 5).map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.src ? (
                            <img
                              src={product.images[0].src}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {product.images?.length ?? 0} images
                            </p>
                          </div>
                        </div>
                        <Button size="sm">
                          <Wand2 className="mr-2 h-4 w-4" />
                          Optimize
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    All products have been optimized!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <OptimizationCard
                icon={Type}
                title="Title Optimization"
                description="Generate SEO-friendly product titles"
                credits={1}
              />
              <OptimizationCard
                icon={Type}
                title="Description Enhancement"
                description="Create compelling product descriptions"
                credits={1}
              />
              <OptimizationCard
                icon={Sparkles}
                title="SEO Keywords"
                description="Generate relevant keywords and tags"
                credits={1}
              />
            </div>

            {productsNeedingOptimization &&
            productsNeedingOptimization.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Products Needing Content Optimization</CardTitle>
                  <CardDescription>
                    Improve your product titles and descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productsNeedingOptimization.slice(0, 5).map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description || "No description"}
                          </p>
                        </div>
                        <Button size="sm" className="ml-4">
                          <Wand2 className="mr-2 h-4 w-4" />
                          Optimize
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    All products have been optimized!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function OptimizationCard({
  icon: Icon,
  title,
  description,
  credits,
}: {
  icon: any;
  title: string;
  description: string;
  credits: number;
}) {
  return (
    <Card className="cursor-pointer hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary" />
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {credits} credit{credits > 1 ? "s" : ""}
          </span>
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
