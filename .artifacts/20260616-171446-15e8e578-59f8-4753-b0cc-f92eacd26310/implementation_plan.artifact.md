# Cloud Video Upload and Notification Feature (Prerequisites)

This plan outlines the preliminary steps required to support cloud video uploads and notifications. As per user request, actual cloud features (Firebase implementation) are excluded, focusing only on the necessary infrastructure and UI updates.

## User Review Required

- **Video Recording Plugin**: Switching from `@capacitor-community/camera-preview` (image-centric) to `@capacitor-community/video-recorder` for actual video capture.
- **Dependencies**: Adding `@capacitor-firebase/storage`, `@capacitor/push-notifications`, `@capacitor-community/video-recorder`, and `@capacitor/filesystem`.

## Proposed Changes

### Dependencies & Environment

#### [package.json](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/package.json)

- Add dependencies for Firebase Storage, Push Notifications, Video Recording, and Filesystem.

```json
{
  "dependencies": {
    "@capacitor-firebase/storage": "^6.0.0",
    "@capacitor/push-notifications": "^6.0.0",
    "@capacitor-community/video-recorder": "^6.0.0",
    "@capacitor/filesystem": "^6.0.0"
  }
}
```

#### [build.gradle](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/android/app/build.gradle)

- Add Firebase BOM and specific dependencies for Storage and Messaging.

```gradle
dependencies {
    // ... existing
    implementation platform('com.google.firebase:firebase-bom:33.1.2')
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-messaging'
}
```

---

### Mobile Features (React)

#### [VideoRecording.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/pages/mobile/VideoRecording.tsx)

- Replace `CameraPreview` with `VideoRecorder` logic.
- Add file size validation logic (stubbed).
- Update UI to handle video preview instead of static image.

#### [ProcessingScreen.tsx](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/pages/mobile/ProcessingScreen.tsx)

- Add "Uploading to Secure Cloud" step to the progress list.
- Update progress calculation to account for the new step.

#### [syncManager.ts](file:///C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/src/app/utils/syncManager.ts)

- Add log markers for cloud synchronization.
- Update `uploadClaim` to be a placeholder for future Firebase Storage calls.

---

## Verification Plan

### Automated Tests
- N/A (Project lacks test suite).

### Manual Verification
1. **Dependency Check**: Run `npm install` to ensure no version conflicts.
2. **Video Recording Flow**: Verify the `VideoRecording.tsx` UI correctly triggers the `VideoRecorder` (simulated in browser, actual on device).
3. **File Size Alert**: Trigger a simulated large file size and verify the toast error appears.
4. **Processing Steps**: Verify the new "Uploading to Secure Cloud" step appears in the `ProcessingScreen`.
