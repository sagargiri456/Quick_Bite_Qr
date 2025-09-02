'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { offlineSync } from '@/lib/offline/offlineSync';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function ServiceWorkerRegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [canShowNotificationPrompt, setCanShowNotificationPrompt] = useState(false);

  useEffect(() => {
    // This entire block of code will only run on the client side.

    // Check if the app is already installed (PWA mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
      return; // No need to show install prompts if already installed
    }

    // --- Service Worker Registration ---
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };
    registerServiceWorker();

    // --- PWA Install Prompt Logic ---
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // --- Offline Sync Logic ---
    const handleOnline = async () => {
      console.log('App is back online, checking for pending actions...');
      try {
        if (await offlineSync.hasPendingActions()) {
          const result = await offlineSync.syncPendingActions();
          console.log('Sync result:', result);
          if (result.syncedActions > 0 && Notification.permission === 'granted') {
            new Notification('Sync Complete', {
              body: `Successfully synced ${result.syncedActions} actions.`,
              icon: '/favicon.ico',
            });
          }
        }
      } catch (error) {
        console.error('Failed to sync pending actions:', error);
      }
    };
    window.addEventListener('online', handleOnline);

    // --- Notification Permission Check ---
    if ('Notification' in window && Notification.permission === 'default') {
      setCanShowNotificationPrompt(true);
    }

    // Cleanup listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt.');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
      setCanShowNotificationPrompt(false); // Hide prompt regardless of choice
    }
  };

  if (isAppInstalled) {
    return null;
  }

  return (
    <>
      {/* PWA Install Prompt Card */}
      {showInstallPrompt && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg animate-in fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Install App
            </CardTitle>
            <CardDescription>
              Get quick access and offline features.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={handleInstallClick} className="flex-1">
              Install
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowInstallPrompt(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification Permission Card */}
      {canShowNotificationPrompt && (
        <Card data-notification-permission className="fixed bottom-4 left-4 w-80 z-50 shadow-lg animate-in fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Enable Notifications</CardTitle>
            <CardDescription>
              Get notified about new orders and updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={requestNotificationPermission} className="flex-1">
              Enable
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCanShowNotificationPrompt(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}