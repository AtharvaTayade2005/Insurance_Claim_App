// Sync Manager for AIVALA Platform
// Handles automatic syncing of offline claims when network is available

import { offlineStorage, OfflineClaim } from './offlineStorage';
import { toast } from 'sonner';

class SyncManager {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  // Start auto-sync (checks every 30 seconds when online)
  startAutoSync() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncPendingClaims();
      }
    }, 30000); // Check every 30 seconds
  }

  // Stop auto-sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Sync all pending claims
  async syncPendingClaims(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return { success: 0, failed: 0 };
    }

    if (!navigator.onLine) {
      console.log('Cannot sync: offline');
      return { success: 0, failed: 0 };
    }

    this.isSyncing = true;
    const queue = offlineStorage.getSyncQueue();
    let successCount = 0;
    let failedCount = 0;

    toast.info(`Syncing ${queue.pendingUploads.length} pending claims...`);

    for (const claimId of queue.pendingUploads) {
      const claim = offlineStorage.getClaim(claimId);
      if (!claim) continue;

      try {
        const success = await this.uploadClaim(claim);
        if (success) {
          offlineStorage.deleteClaim(claimId);
          successCount++;
        } else {
          offlineStorage.markAsFailed(claimId);
          failedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync claim ${claimId}:`, error);
        offlineStorage.markAsFailed(claimId);
        failedCount++;
      }
    }

    this.isSyncing = false;

    if (successCount > 0) {
      toast.success(`${successCount} claim${successCount > 1 ? 's' : ''} uploaded successfully`);
    }
    if (failedCount > 0) {
      toast.error(`${failedCount} claim${failedCount > 1 ? 's' : ''} failed to upload`);
    }

    return { success: successCount, failed: failedCount };
  }

  // Upload a single claim (simulated for now)
  private async uploadClaim(claim: OfflineClaim): Promise<boolean> {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        console.log(`Upload ${claim.id}: ${success ? 'success' : 'failed'}`);
        resolve(success);
      }, 2000);
    });
  }

  // Manual sync trigger
  async syncNow(): Promise<{ success: number; failed: number }> {
    if (!navigator.onLine) {
      toast.error('Cannot sync: You are offline');
      return { success: 0, failed: 0 };
    }

    return this.syncPendingClaims();
  }

  // Retry failed uploads
  async retryFailed(): Promise<{ success: number; failed: number }> {
    const queue = offlineStorage.getSyncQueue();
    
    // Move failed back to pending
    queue.pendingUploads.push(...queue.failedUploads);
    queue.failedUploads = [];
    localStorage.setItem('aivala_sync_queue', JSON.stringify(queue));

    return this.syncPendingClaims();
  }

  // Check if currently syncing
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

export const syncManager = new SyncManager();

// Auto-start sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network restored, starting auto-sync...');
    syncManager.syncNow();
  });
}
