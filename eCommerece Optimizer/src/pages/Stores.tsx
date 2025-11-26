import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Store, ExternalLink, Trash2, RefreshCw } from "lucide-react";

export function Stores() {
  const stores = useQuery(api.stores.getMyStores);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">
            Manage your connected eCommerce stores
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Connect WooCommerce Store</DialogTitle>
              <DialogDescription>
                Enter your WooCommerce REST API credentials to connect your
                store.
              </DialogDescription>
            </DialogHeader>
            <AddStoreForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Store List */}
      {stores?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No stores connected</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Connect your WooCommerce or Shopify store to start optimizing your
              products.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores?.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddStoreForm({ onSuccess }: { onSuccess: () => void }) {
  const connectStore = useMutation(api.stores.connectWooCommerce);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const consumerKey = formData.get("consumerKey") as string;
    const consumerSecret = formData.get("consumerSecret") as string;

    try {
      await connectStore({ name, url, consumerKey, consumerSecret });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect store");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="My WooCommerce Store"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Store URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://mystore.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="consumerKey">Consumer Key</Label>
        <Input
          id="consumerKey"
          name="consumerKey"
          placeholder="ck_xxxxxxxxxxxxxxxx"
          required
        />
        <p className="text-xs text-muted-foreground">
          Generate in WooCommerce → Settings → Advanced → REST API
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="consumerSecret">Consumer Secret</Label>
        <Input
          id="consumerSecret"
          name="consumerSecret"
          type="password"
          placeholder="cs_xxxxxxxxxxxxxxxx"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Connecting..." : "Connect Store"}
      </Button>
    </form>
  );
}

function StoreCard({ store }: { store: any }) {
  const deleteStore = useMutation(api.stores.deleteStore);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    setIsDeleting(true);
    try {
      await deleteStore({ storeId: store._id });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${store.isActive ? "bg-green-500" : "bg-gray-300"}`}
            />
            <CardTitle className="text-lg">{store.name}</CardTitle>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
            {store.platform}
          </span>
        </div>
        <CardDescription className="flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          {store.url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>
            Last sync:{" "}
            {store.lastSyncAt
              ? new Date(store.lastSyncAt).toLocaleDateString()
              : "Never"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
