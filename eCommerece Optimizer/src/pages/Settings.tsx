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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bot, Globe, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function Settings() {
  const user = useQuery(api.users.getCurrentUser);
  const updateSettings = useMutation(api.users.updateSettings);

  const [aiProvider, setAiProvider] = useState<"openai" | "claude" | "gemini">("openai");
  const [language, setLanguage] = useState<"en" | "he">("en");
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setAiProvider(user.settings.defaultAIProvider);
      setLanguage(user.settings.defaultLanguage);
      setAutoOptimize(user.settings.autoOptimize);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        defaultAIProvider: aiProvider,
        defaultLanguage: language,
        autoOptimize,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your optimization preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* AI Provider Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle>AI Provider</CardTitle>
            </div>
            <CardDescription>
              Choose your preferred AI provider for content optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">Default AI Provider</Label>
              <Select
                value={aiProvider}
                onValueChange={(value: "openai" | "claude" | "gemini") =>
                  setAiProvider(value)
                }
              >
                <SelectTrigger id="ai-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                  <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  <SelectItem value="gemini">Gemini (Google)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will be used for title and description optimization
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Language</CardTitle>
            </div>
            <CardDescription>
              Set your default content language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select
                value={language}
                onValueChange={(value: "en" | "he") => setLanguage(value)}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="he">Hebrew (עברית)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                AI will generate content in this language
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <CardTitle>Automation</CardTitle>
            </div>
            <CardDescription>
              Configure automatic optimization settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-optimize">Auto-optimize new products</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize products when they are added to your store
                </p>
              </div>
              <Switch
                id="auto-optimize"
                checked={autoOptimize}
                onCheckedChange={setAutoOptimize}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="capitalize">{user?.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Credits</span>
                <span>{user?.monthlyCredits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
