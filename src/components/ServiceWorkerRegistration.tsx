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
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setSwRegistration(registration);
        console.log('Service Worker registered successfully:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          }
        });

        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  // Show update notification
  const showUpdateNotification = () => {
    if (confirm('A new version is available! Click OK to update.')) {
      window.location.reload();
    }
  };

  // Handle install prompt
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // Handle sync when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('App is back online, syncing pending actions...');
      
      try {
        const hasPending = await offlineSync.hasPendingActions();
        if (hasPending) {
          const result = await offlineSync.syncPendingActions();
          console.log('Sync result:', result);
          
          if (result.syncedActions > 0) {
            // Show success notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Sync Complete', {
                body: `Successfully synced ${result.syncedActions} actions`,
                icon: '/favicon.ico'
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to sync pending actions:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }
  };

  // Don't show anything if app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Install Quick Bite QR
            </CardTitle>
            <CardDescription>
              Install this app on your device for quick access and offline functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Permission Request */}
      {!isInstalled && 'Notification' in window && Notification.permission === 'default' && (
        <Card className="fixed bottom-4 left-4 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Enable Notifications</CardTitle>
            <CardDescription>
              Get notified about new orders and updates even when the app is closed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={requestNotificationPermission} className="flex-1">
                Enable
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  // Hide the notification permission request
                  const element = document.querySelector('[data-notification-permission]');
                  if (element) element.remove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
} 