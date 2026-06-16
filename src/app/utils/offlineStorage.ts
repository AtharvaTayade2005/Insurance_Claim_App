// Offline Storage Manager for AIVALA Platform
// Handles local storage of claims, videos, and sync queue

export interface OfflineClaim {
  id: string;
  type: 'auto' | 'property';
  status: 'draft' | 'pending_upload';
  videoBlob?: string; // Base64 encoded video
  claimData: {
    description?: string;
    location?: string;
    vehicleInfo?: string;
    propertyInfo?: string;
  };
  createdAt: string;
  lastModified: string;
  size: number; // in bytes
}

export interface SyncQueue {
  pendingUploads: string[]; // claim IDs
  failedUploads: string[];
  lastSyncAttempt?: string;
}

class OfflineStorageManager {
  private readonly STORAGE_KEY_CLAIMS = 'aivala_offline_claims';
  private readonly STORAGE_KEY_QUEUE = 'aivala_sync_queue';
  private readonly MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly MAX_CLAIMS = 10;

  // Save claim offline
  saveClaim(claim: OfflineClaim): boolean {
    try {
      const claims = this.getAllClaims();
      
      // Check storage limits
      if (claims.length >= this.MAX_CLAIMS) {
        console.warn('Maximum offline claims limit reached');
        return false;
      }

      const totalSize = this.getTotalStorageSize();
      if (totalSize + claim.size > this.MAX_STORAGE_SIZE) {
        console.warn('Storage limit exceeded');
        return false;
      }

      claims.push(claim);
      localStorage.setItem(this.STORAGE_KEY_CLAIMS, JSON.stringify(claims));
      
      // Add to sync queue
      this.addToSyncQueue(claim.id);
      
      return true;
    } catch (error) {
      console.error('Failed to save offline claim:', error);
      return false;
    }
  }

  // Get all offline claims
  getAllClaims(): OfflineClaim[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_CLAIMS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to retrieve offline claims:', error);
      return [];
    }
  }

  // Get specific claim
  getClaim(id: string): OfflineClaim | null {
    const claims = this.getAllClaims();
    return claims.find(c => c.id === id) || null;
  }

  // Update claim
  updateClaim(id: string, updates: Partial<OfflineClaim>): boolean {
    try {
      const claims = this.getAllClaims();
      const index = claims.findIndex(c => c.id === id);
      
      if (index === -1) return false;
      
      claims[index] = {
        ...claims[index],
        ...updates,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY_CLAIMS, JSON.stringify(claims));
      return true;
    } catch (error) {
      console.error('Failed to update offline claim:', error);
      return false;
    }
  }

  // Delete claim
  deleteClaim(id: string): boolean {
    try {
      const claims = this.getAllClaims();
      const filtered = claims.filter(c => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY_CLAIMS, JSON.stringify(filtered));
      
      // Remove from sync queue
      this.removeFromSyncQueue(id);
      
      return true;
    } catch (error) {
      console.error('Failed to delete offline claim:', error);
      return false;
    }
  }

  // Get sync queue
  getSyncQueue(): SyncQueue {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_QUEUE);
      return data ? JSON.parse(data) : { pendingUploads: [], failedUploads: [] };
    } catch (error) {
      console.error('Failed to retrieve sync queue:', error);
      return { pendingUploads: [], failedUploads: [] };
    }
  }

  // Add to sync queue
  private addToSyncQueue(claimId: string): void {
    const queue = this.getSyncQueue();
    if (!queue.pendingUploads.includes(claimId)) {
      queue.pendingUploads.push(claimId);
      localStorage.setItem(this.STORAGE_KEY_QUEUE, JSON.stringify(queue));
    }
  }

  // Remove from sync queue
  private removeFromSyncQueue(claimId: string): void {
    const queue = this.getSyncQueue();
    queue.pendingUploads = queue.pendingUploads.filter(id => id !== claimId);
    queue.failedUploads = queue.failedUploads.filter(id => id !== claimId);
    localStorage.setItem(this.STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }

  // Mark as failed upload
  markAsFailed(claimId: string): void {
    const queue = this.getSyncQueue();
    queue.pendingUploads = queue.pendingUploads.filter(id => id !== claimId);
    if (!queue.failedUploads.includes(claimId)) {
      queue.failedUploads.push(claimId);
    }
    queue.lastSyncAttempt = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }

  // Get total storage size
  getTotalStorageSize(): number {
    const claims = this.getAllClaims();
    return claims.reduce((total, claim) => total + claim.size, 0);
  }

  // Get storage info
  getStorageInfo() {
    const claims = this.getAllClaims();
    const totalSize = this.getTotalStorageSize();
    const queue = this.getSyncQueue();
    
    return {
      claimCount: claims.length,
      maxClaims: this.MAX_CLAIMS,
      totalSize,
      maxSize: this.MAX_STORAGE_SIZE,
      usagePercentage: (totalSize / this.MAX_STORAGE_SIZE) * 100,
      pendingUploads: queue.pendingUploads.length,
      failedUploads: queue.failedUploads.length
    };
  }

  // Clear all offline data
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY_CLAIMS);
    localStorage.removeItem(this.STORAGE_KEY_QUEUE);
  }

  // Format bytes to readable size
  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

export const offlineStorage = new OfflineStorageManager();
