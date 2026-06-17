# Insurance Claim App - Technical Prototype

A high-performance Android application designed for insurance claim evidence collection. This app features a **Native Split-Screen Camera** implementation and **Google Cloud Storage (GCS)** integration via Firebase for secure, real-time evidence archiving.

---

## 🚀 Deployment Guide

Follow these steps to deploy and run this project on your machine and Android device.

### 1. Prerequisites
Ensure you have the following installed on your system:
*   **Node.js** (v18 or higher)
*   **Android Studio** (Koala or newer recommended)
*   **Git**
*   **An Android Device** (Physical device recommended for camera testing)

### 2. Initial Setup
Clone the repository and install the dependencies:
```bash
# Clone the repository
git clone https://github.com/AtharvaTayade2005/Insurance_Claim_App.git

# Enter the project folder
cd Insurance_Claim_App

# Install dependencies
npm install
```

### 3. Build the Web Assets
The app's UI is built with React/Vite. You must build the production assets before syncing with Android:
```bash
npm run build
```

### 4. Sync with Capacitor
Sync the built web assets into the Android native project:
```bash
npx cap sync android
```

### 5. Run in Android Studio
1.  Open **Android Studio**.
2.  Select **"Open"** and choose the `android` folder within the project directory.
3.  Wait for the Gradle sync to finish (this may take 2-5 minutes).
4.  Connect your Android device via **USB** or **Wireless Debugging**.
5.  Press the **Run (Green Play Button)** in Android Studio.

---

## 🛠️ Key Technical Features

### 1. Native Split-Screen Camera
To bypass transparency limitations on modern Android devices, this app implements a physical split-screen bridge:
*   **Location:** `android/node_modules/@capacitor-community/video-recorder/android/src/main/java/com/capacitorcommunity/videorecorder/VideoRecorderPlugin.java`
*   **Architecture:** The top 50% of the screen is dedicated to the native hardware Rear Camera, while the bottom 50% hosts the interactive Web UI. This ensures 100% button responsiveness and visibility.

### 2. GCS Cloud Integration
The app uses Firebase/Google Cloud Storage for secure evidence management:
*   **Config:** `android/app/google-services.json`
*   **Flow:** Video is recorded locally, then streamed directly to a secure GCS bucket upon user confirmation.
*   **Verification:** Uploads can be viewed in real-time via the [Firebase Storage Console](https://console.firebase.google.com/).

### 3. High-Definition State Management
We implemented a centralized `activeCall` tracker in the native Java plugin to synchronize high-definition video processing between the software UI and the camera hardware, resolving common "Recording Hang" issues.

---

## 📝 Troubleshooting
*   **Black Screen:** Ensure you have granted **Camera** and **Microphone** permissions.
*   **Git Path Errors:** This project contains long file paths. If `git add` fails, run:
    `git config core.longpaths true`

---
*Created as a technical prototype for Insurance Claim Evidence Collection.*
