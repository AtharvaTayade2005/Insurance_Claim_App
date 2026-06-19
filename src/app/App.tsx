import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { notificationService } from '@/app/utils/notificationService';
import { syncManager } from '@/app/utils/syncManager';

export default function App() {
  useEffect(() => {
    // Initialize notifications on app start
    notificationService.init();
    
    // Start auto-sync interval for offline claims
    syncManager.startAutoSync();
  }, []);

  return <RouterProvider router={router} />;
}
