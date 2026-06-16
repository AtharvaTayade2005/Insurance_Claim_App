# Cloud Video Upload and Notification Feature

Add a feature where inspectors can upload car inspection videos to Google Cloud Storage (via Firebase Storage), receive notifications upon completion, and get alerts regarding file size.

## User Review Required

> [!IMPORTANT]
> - **Firebase Configuration**: To enable actual GCS uploads, a `google-services.json` file and Firebase project setup are required. I will implement the logic, but the user will need to provide the configuration file.
> - **Cloud Functions**: For "Cloud Notifications" (FCM), a backend trigger (Cloud Function) on GCS upload completion is the most robust way. I will provide the frontend logic to handle notifications and simulate the backend part if needed.
> - **Library Additions**: I will need to add `@capacitor-firebase/storage` and `@capacitor/push-notifications` to the project.

## Proposed Changes

### Frontend (Capacitor/React)

#### [package.json](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/package.json)
- Add `@capacitor-firebase/storage` for GCS integration.
- Add `@capacitor/push-notifications` for cloud notifications.

#### [VideoRecording.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/pages/mobile/VideoRecording.tsx)
- Update to support video recording instead of just image capture (if possible with current plugin, or switch to `Capacitor Video Recorder`).
- Add file size check before proceeding.
- Show alert/toast if the video is too large.

#### [ProcessingScreen.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/pages/mobile/ProcessingScreen.tsx)
- Implement actual upload logic using `FirebaseStorage`.
- Add progress monitoring.
- Handle success/failure states and trigger local notifications as a fallback for cloud notifications.

#### [syncManager.ts](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/utils/syncManager.ts)
- Integrate GCS upload logic into the `uploadClaim` method.

---

### Android Native

#### [build.gradle](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/android/app/build.gradle)
- Add Firebase SDK dependencies.

#### [MainActivity.java](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/android/app/src/main/java/com/saumi/aivala/MainActivity.java)
- Register new plugins if necessary (Capacitor 3+ usually auto-registers).

## Verification Plan

### Automated Tests
- N/A (Project doesn't seem to have a test suite currently).

### Manual Verification
- **File Size Alert**: Attempt to upload a large dummy file and verify the alert triggers.
- **Upload Progress**: Observe the progress bar during the upload phase in `ProcessingScreen`.
- **Notification**: Verify a notification appears once the "upload" (or simulated cloud process) is complete.
- **Offline Sync**: Verify that uploads are queued when offline and resumed when online.
