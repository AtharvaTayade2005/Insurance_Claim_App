import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';

class NotificationService {
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied permissions for notifications');
        return;
      }

      // Register for FCM
      await PushNotifications.register();

      // Listeners
      this.addListeners();
      this.isInitialized = true;
      console.log('Notification Service Initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private addListeners() {
    // On registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Here you would normally send the token to your backend
    });

    // On registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Notification received while app is open
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
      toast.info(notification.title || 'New Notification', {
        description: notification.body,
      });
    });

    // Notification tapped by user
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      // Logic to navigate can be added here if needed
    });
  }

  // Helper for sending local feedback notifications
  async sendLocalNotification(title: string, body: string) {
    // In a real app, this might use @capacitor/local-notifications
    // For now, we use the toast for immediate feedback and log it
    toast(title, {
      description: body,
    });
  }
}

export const notificationService = new NotificationService();
