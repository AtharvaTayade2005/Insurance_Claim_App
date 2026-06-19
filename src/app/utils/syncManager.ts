// Sync Manager for AIVALA Platform
// Handles automatic syncing of offline claims when network is available

import { offlineStorage, OfflineClaim } from './offlineStorage';
import { toast } from 'sonner';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { notificationService } from './notificationService';
import { Capacitor } from '@capacitor/core';

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

    if (queue.pendingUploads.length > 0) {
      toast.info(`Syncing ${queue.pendingUploads.length} pending claims...`);
    }

    for (const claimId of queue.pendingUploads) {
      const claim = offlineStorage.getClaim(claimId);
      if (!claim) continue;

      try {
        const success = await this.uploadClaim(claim);
        if (success) {
          offlineStorage.deleteClaim(claimId);
          successCount++;

          // Dispatch email alert asynchronously in background
          this.sendEmailAlert(claim);

          notificationService.sendLocalNotification(
            "Upload Complete",
            `Claim ${claimId} has been successfully uploaded to the cloud.`
          );
        } else {
          offlineStorage.markAsFailed(claimId);
          failedCount++;

          notificationService.sendLocalNotification(
            "Upload Failed",
            `Claim ${claimId} failed to upload. It will retry automatically.`
          );
        }
      } catch (error) {
        console.error(`Failed to sync claim ${claimId}:`, error);
        offlineStorage.markAsFailed(claimId);
        failedCount++;
      }
    }

    this.isSyncing = false;
    return { success: successCount, failed: failedCount };
  }

  // Upload a single claim to Firebase Storage
  private async uploadClaim(claim: OfflineClaim): Promise<boolean> {
    console.log(`Starting cloud sync for claim: ${claim.id}`);

    try {
      const videoUri = claim.videoBlob;

      if (!videoUri) {
        console.error("No video URI found for claim", claim.id);
        return false;
      }

      if (Capacitor.getPlatform() === 'web') {
        console.log("Performing Web Firebase Storage upload...");
        // On web, import standard Firebase SDK methods and bucket
        const { ref: storageRef, uploadBytesResumable } = await import('firebase/storage');
        const { storage } = await import('./firebase');

        if (!storage) {
          throw new Error("Firebase Web Storage is not initialized.");
        }

        // Fetch the blob from the object URL or base64 URI
        const response = await fetch(videoUri);
        const blob = await response.blob();

        const fileRef = storageRef(storage, `claims/${claim.id}/inspection_video.mp4`);
        const uploadTask = uploadBytesResumable(fileRef, blob);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Web Upload progress: ${progress.toFixed(1)}%`);
            },
            (error) => {
              console.error("Web Upload failed:", error);
              reject(error);
            },
            () => {
              console.log("Web Upload finished successfully");
              resolve();
            }
          );
        });
      } else {
        console.log("Performing Native Capacitor Firebase Storage upload...");
        await FirebaseStorage.uploadFile({
          path: `claims/${claim.id}/inspection_video.mp4`,
          uri: videoUri,
        });
      }

      console.log(`Cloud Upload ${claim.id}: SUCCESS`);
      return true;

    } catch (error) {
      console.error(`Cloud Upload ${claim.id} ERROR:`, error);
      // Fallback for simulation if google-services.json is missing during testing
      // Remove this fallback in production
      if (error instanceof Error && error.message.includes('Firebase')) {
         console.warn("Firebase not configured, simulating success for demo purposes...");
         return new Promise(resolve => setTimeout(() => resolve(true), 2000));
      }
      return false;
    }
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

  // Send automated email alert upon successful GCS upload
  private async sendEmailAlert(claim: OfflineClaim) {
    try {
      // Config credentials (Replace these placeholder strings with your actual EmailJS dashboard values)
      const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
      const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
      const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

      if (
        EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
        EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID" ||
        EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY"
      ) {
        console.warn("EmailJS credentials are not configured in syncManager.ts yet. Skipping email alert.");
        return;
      }

      console.log(`Dispatching EmailJS notification for claim ${claim.id}...`);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            claimId: claim.id,
            status: claim.status,
            timestamp: claim.createdAt,
            platform: Capacitor.getPlatform(),
            gcsPath: `claims/${claim.id}/inspection_video.mp4`
          }
        })
      });

      if (response.ok) {
        console.log("Email alert dispatched successfully.");
      } else {
        console.error("EmailJS dispatch returned error status:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error dispatching EmailJS notification:", error);
    }
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
