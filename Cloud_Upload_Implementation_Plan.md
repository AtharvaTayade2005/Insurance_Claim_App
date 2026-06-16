# Implementation Plan: Cloud Video Upload & Notifications

This document provides a comprehensive, step-by-step guide for implementing the Cloud Video Upload and Notification feature for the AIVALA platform.

---

## Phase 1: Environment & Dependency Setup
*Objective: Prepare the project with the necessary libraries and native configurations.*

### Step 1: Install Capacitor Plugins
Run the following commands in your terminal to add the required functionality:
- **Firebase Storage**: `@capacitor-firebase/storage`
- **Push Notifications**: `@capacitor/push-notifications`
- **Video Recording**: `@capacitor-community/video-recorder`
- **Filesystem Access**: `@capacitor/filesystem`

### Step 2: Android Native Configuration
1. Open `android/app/build.gradle`.
2. Add the Firebase BoM (Bill of Materials) to ensure version compatibility.
3. Add dependencies for `firebase-storage` and `firebase-messaging`.
4. Register the plugins in `MainActivity.java` (if using Capacitor < 3, otherwise auto-registration handles it).

### Step 3: Firebase Project Setup (Action Required)
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add an Android App to the project using the package name `com.saumi.aivala`.
3. Download the `google-services.json` file and place it in the `android/app/` directory.

---

## Phase 2: Video Recording Enhancements
*Objective: Upgrade the capture flow from images to video with validation.*

### Step 1: Refactor VideoRecording.tsx
- Replace the `CameraPreview` plugin with `@capacitor-community/video-recorder`.
- Update the UI to show a live video preview overlay.
- Implement a recording timer and progress bar.

### Step 2: Implement File Size Validation
- After recording, use `@capacitor/filesystem` to check the file size.
- **Constraint**: If the file exceeds 50MB, show a "Sonner" toast warning and prevent the upload.
- Provide a "Retake" option to allow the user to record a shorter video.

---

## Phase 3: Processing & Synchronization
*Objective: Visualizing the upload progress and handling background sync.*

### Step 1: Update ProcessingScreen.tsx
- Insert a new initial step: **"Uploading to Secure Cloud"**.
- Update the progress animation logic to reflect actual upload percentage once integrated.
- Ensure the AI analysis steps only begin after a successful "Upload" signal.

### Step 2: Enhance syncManager.ts
- Modify the `uploadClaim` method to handle video file paths.
- Add stubs for `FirebaseStorage.uploadFile()`.
- Implement retry logic specifically for large video uploads that might fail on poor connections.

---

## Phase 4: Cloud Notifications
*Objective: Notify the user when the backend processing is complete.*

### Step 1: Push Notification Initialization
- Configure the app to request notification permissions on the first launch.
- Store the FCM (Firebase Cloud Messaging) token for the device.

### Step 2: Notification Handling
- Implement listeners for "Foreground" notifications (so users see alerts while using the app).
- Implement "Action" listeners to navigate the user directly to the results screen when they tap a notification.

---

## Phase 5: Verification & Testing
1. **Offline Test**: Record a video while in Airplane Mode. Verify it saves to the "Sync Queue".
2. **Size Test**: Attempt to upload a dummy 60MB file. Verify the "File too large" alert triggers.
3. **Progress Test**: Observe the progress bar during upload to ensure it is smooth and accurate.
4. **Notification Test**: Trigger a test message from the Firebase Console to verify the device receives it.
