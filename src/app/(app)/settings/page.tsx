'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey) {
        toast({
            variant: 'destructive',
            title: 'API Key is empty',
            description: 'Please enter a valid Gemini API key.',
        });
        return;
    }
    localStorage.setItem('gemini_api_key', apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been saved in your browser.',
    });
  };

  const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
       <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and notification preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Set your Gemini API Key. This is stored securely in your browser&apos;s local storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input 
              id="api-key" 
              type="password"
              placeholder="Enter your API key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            Check if your API keys and project settings are configured correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {apiKey ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span>Gemini API Key</span>
            </div>
            {apiKey ? (
              <span className="font-medium text-green-600">Configured</span>
            ) : (
              <span className="font-medium text-destructive">Not Configured</span>
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                {isFirebaseConfigured ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span>Firebase Configuration</span>
              </div>
              {isFirebaseConfigured ? (
                <span className="font-medium text-green-600">Configured</span>
              ) : (
                <span className="font-medium text-destructive">Not Configured</span>
              )}
            </div>
            {!isFirebaseConfigured && (
              <p className="text-xs text-muted-foreground pl-8">
                Firebase keys not found. Please add them to your <code className="font-mono text-xs bg-muted p-1 rounded">.env</code> file.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive real-time alerts on your device.
              </span>
            </Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="email-summary" className="flex flex-col space-y-1">
              <span>Email Summaries</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get a weekly summary of insights and activities.
              </span>
            </Label>
            <Switch id="email-summary" />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account details and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Log out from all devices</p>
            <Button variant="outline">Log Out</Button>
          </div>
          <Separator />
           <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">Delete Account</p>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
