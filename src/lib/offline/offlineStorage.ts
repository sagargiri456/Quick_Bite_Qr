// Offline storage utility using IndexedDB
export interface PendingAction {
  id: string;
  type: 'create_order' | 'update_menu' | 'delete_menu_item' | 'update_profile';
  data: any;
  timestamp: number;
  retryCount: number;
}

export interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

class OfflineStorage {
  private dbName = 'QuickBiteOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create pending actions store
        if (!db.objectStoreNames.contains('pendingActions')) {
          const pendingStore = db.createObjectStore('pendingActions', { keyPath: 'id' });
          pendingStore.createIndex('type', 'type', { unique: false });
          pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create cached data store
        if (!db.objectStoreNames.contains('cachedData')) {
          const cacheStore = db.createObjectStore('cachedData', { keyPath: 'key' });
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  // Pending Actions Management
  async addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<string> {
    if (!this.db) await this.init();
    
    const id = crypto.randomUUID();
    const pendingAction: PendingAction = {
      ...action,
      id,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.add(pendingAction);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingActions(type?: string): Promise<PendingAction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = type 
        ? store.index('type').getAll(type)
        : store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingAction(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updatePendingActionRetryCount(id: string, retryCount: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.retryCount = retryCount;
          const putRequest = store.put(action);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Pending action not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Cached Data Management
  async setCachedData(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();

    const cachedData: CachedData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const request = store.put(cachedData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedData(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const request = store.get(key);

      request.onsuccess = () => {
        const cached = request.result;
        if (cached && cached.expiresAt > Date.now()) {
          resolve(cached.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeCachedData(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('expiresAt');
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Utility methods
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions', 'cachedData'], 'readwrite');
      
      transaction.objectStore('pendingActions').clear();
      transaction.objectStore('cachedData').clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getStorageStats(): Promise<{ pendingActions: number; cachedData: number }> {
    if (!this.db) await this.init();

    const pendingActions = await this.getPendingActions();
    const cachedData = await this.getCachedData('stats'); // This is a placeholder

    return {
      pendingActions: pendingActions.length,
      cachedData: 0, // Would need to implement proper counting
    };
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Initialize storage when module is imported
offlineStorage.init().catch(console.error); 