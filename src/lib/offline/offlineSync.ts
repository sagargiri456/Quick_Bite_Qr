import { offlineStorage, PendingAction } from './offlineStorage';

export interface SyncResult {
  success: boolean;
  syncedActions: number;
  failedActions: number;
  errors: string[];
}

export class OfflineSync {
  private isSyncing = false;
  private syncQueue: (() => Promise<void>)[] = [];

  // Add an action to be synced when online
  async queueAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<string> {
    try {
      const id = await offlineStorage.addPendingAction(action);
      console.log('Action queued for sync:', action.type, id);
      return id;
    } catch (error) {
      console.error('Failed to queue action:', error);
      throw error;
    }
  }

  // Process all pending actions when coming back online
  async syncPendingActions(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, syncedActions: 0, failedActions: 0, errors: ['Sync already in progress'] };
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      syncedActions: 0,
      failedActions: 0,
      errors: []
    };

    try {
      const pendingActions = await offlineStorage.getPendingActions();
      console.log(`Syncing ${pendingActions.length} pending actions`);

      for (const action of pendingActions) {
        try {
          await this.processAction(action);
          await offlineStorage.removePendingAction(action.id);
          result.syncedActions++;
          console.log(`Successfully synced action: ${action.type}`);
        } catch (error) {
          result.failedActions++;
          const errorMessage = `Failed to sync ${action.type}: ${error}`;
          result.errors.push(errorMessage);
          console.error(errorMessage);

          // Update retry count
          const newRetryCount = action.retryCount + 1;
          if (newRetryCount >= 3) {
            // Remove action after 3 failed attempts
            await offlineStorage.removePendingAction(action.id);
            console.log(`Removed action after ${newRetryCount} failed attempts: ${action.type}`);
          } else {
            await offlineStorage.updatePendingActionRetryCount(action.id, newRetryCount);
          }
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync process failed: ${error}`);
      console.error('Sync process failed:', error);
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  // Process individual action based on type
  private async processAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'create_order':
        await this.syncCreateOrder(action.data);
        break;
      case 'update_menu':
        await this.syncUpdateMenu(action.data);
        break;
      case 'delete_menu_item':
        await this.syncDeleteMenuItem(action.data);
        break;
      case 'update_profile':
        await this.syncUpdateProfile(action.data);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Sync order creation
  private async syncCreateOrder(data: any): Promise<void> {
    // This would typically call your API endpoint
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }
  }

  // Sync menu updates
  private async syncUpdateMenu(data: any): Promise<void> {
    const response = await fetch(`/api/menu/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update menu: ${response.statusText}`);
    }
  }

  // Sync menu item deletion
  private async syncDeleteMenuItem(data: any): Promise<void> {
    const response = await fetch(`/api/menu/${data.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete menu item: ${response.statusText}`);
    }
  }

  // Sync profile updates
  private async syncUpdateProfile(data: any): Promise<void> {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }
  }

  // Check if there are pending actions
  async hasPendingActions(): Promise<boolean> {
    const actions = await offlineStorage.getPendingActions();
    return actions.length > 0;
  }

  // Get count of pending actions
  async getPendingActionsCount(): Promise<number> {
    const actions = await offlineStorage.getPendingActions();
    return actions.length;
  }

  // Get pending actions by type
  async getPendingActionsByType(type: string): Promise<PendingAction[]> {
    return await offlineStorage.getPendingActions(type);
  }

  // Clear all pending actions (useful for testing or reset)
  async clearAllPendingActions(): Promise<void> {
    const actions = await offlineStorage.getPendingActions();
    for (const action of actions) {
      await offlineStorage.removePendingAction(action.id);
    }
  }

  // Add to sync queue for background processing
  addToSyncQueue(syncFunction: () => Promise<void>): void {
    this.syncQueue.push(syncFunction);
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const syncFunction = this.syncQueue.shift();
      if (syncFunction) {
        try {
          await syncFunction();
        } catch (error) {
          console.error('Failed to process sync queue item:', error);
        }
      }
    }
  }
}

// Export singleton instance
export const offlineSync = new OfflineSync(); 