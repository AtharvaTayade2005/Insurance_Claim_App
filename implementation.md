# Implementation Plan: Cloud Video Upload Prerequisites

This document outlines the changes to prepare the application for Cloud Video Uploads and Notifications via Firebase.

## 1. Dependency Updates
Add the following to `package.json`:
- `@capacitor-firebase/storage`: For GCS integration.
- `@capacitor/push-notifications`: For cloud notifications.
- `@capacitor-community/video-recorder`: To support actual video recording.
- `@capacitor/filesystem`: To check file sizes and manage local storage.

## 2. Android Configuration
Update `android/app/build.gradle` to include Firebase SDKs:
- Firebase BOM (Bill of Materials)
- Firebase Storage
- Firebase Messaging (FCM)

## 3. UI/UX Enhancements
### Video Recording (`VideoRecording.tsx`)
- Transition from image capture to video recording using `@capacitor-community/video-recorder`.
- Implement a file size check (e.g., 50MB limit) before proceeding with the upload.
- Show alerts/toasts if the video is too large.

### Processing Screen (`ProcessingScreen.tsx`)
- Add a "Cloud Synchronization" step to the processing sequence.
- Simulate/prepare progress monitoring for the upload phase.

## 4. Backend Synchronization (`syncManager.ts`)
- Integrate stubs for GCS upload logic.
- Prepare the sync queue to handle video files in addition to images.

---
*Note: Actual Firebase project configuration (google-services.json) and Cloud Functions are excluded from this prerequisite phase.*
