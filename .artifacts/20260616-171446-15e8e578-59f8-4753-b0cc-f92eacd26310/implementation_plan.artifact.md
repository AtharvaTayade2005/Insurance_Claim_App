# Enable Actual Cloud Uploads and Notifications

This plan enables live Firebase Storage uploads and Capacitor Push Notifications for the car inspection feature.

## User Review Required

> [!IMPORTANT]
> **Firebase Config Required**: To test actual uploads, a valid `google-services.json` must be present in `android/app/`. Without it, the app will gracefully fail or show errors during the native build process.
> **Physical Device**: Push notifications usually require a physical Android device to receive FCM tokens and messages correctly.

## Proposed Changes

### Cloud Integration & Notifications

#### [syncManager.ts](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/utils/syncManager.ts)

- Replace simulation stubs with `@capacitor-firebase/storage` `uploadFile` calls.
- Integrate `@capacitor/push-notifications` to trigger local notifications if the app is in the foreground, or rely on FCM for background completion.
- Add a helper to send local notifications on success/failure as immediate feedback.

#### [NEW] [notificationService.ts](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/utils/notificationService.ts)

- Create a centralized service to initialize Push Notifications, request permissions, and handle listeners.

#### [App.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/App.tsx)

- Initialize the `notificationService` when the app starts.

#### [VideoRecording.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/pages/mobile/VideoRecording.tsx)

- Ensure the `videoUrl` is passed correctly to the `syncManager`.

---

## Verification Plan

### Manual Verification

1. **Permission Request**: Verify that the app asks for notification permissions on startup.
2. **Foreground Notification**:
   - Record and submit a claim.
   - Wait for the upload to complete.
   - Verify a notification appears (Success or Failure).
3. **Storage Check**:
   - Check the Firebase Console Storage bucket for the uploaded video file under the `claims/{id}/` folder.
4. **Log Analysis**:
   - Use `adb logcat` to monitor for "FirebaseStorage" and "PushNotifications" tags to verify token registration and upload status.

### Verification Script

I will provide a script to simulate an "Upload Complete" event if we want to test the notification UI without waiting for a real network upload.
