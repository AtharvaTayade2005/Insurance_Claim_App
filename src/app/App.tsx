import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { notificationService } from '@/app/utils/notificationService';

export default function App() {
  useEffect(() => {
    // Initialize notifications on app start
    notificationService.init();
  }, []);

  return <RouterProvider router={router} />;
}
