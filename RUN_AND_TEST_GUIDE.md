# How to Run and Test the Cloud Upload Feature

This guide will walk you through the steps to get the AIVALA application running on an Android device to test the Firebase Cloud Storage and Push Notification services.

---

## 1. Prerequisites
Before starting, ensure you have the following installed on your computer:
- **Node.js** (v18 or higher)
- **Android Studio** (Koala or later)
- **Java Development Kit (JDK)** (v17 recommended for Capacitor 6+)
- **Git**

---

## 2. Step-by-Step Setup

### Step 1: Install Dependencies
Open your terminal in the project root and run:
```powershell
npm install
```

### Step 2: Configure Firebase (CRITICAL)
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project named **AIVALA**.
3.  Add an **Android App** with the package name `com.saumi.aivala`.
4.  Download the `google-services.json` file.
5.  **Move the file** to the following directory in your project:
    `C:/Users/athar/Downloads/Insurance Claim App Design/Insurance Claim App Design/android/app/google-services.json`

### Step 3: Enable Firebase Services
In the Firebase Console:
- **Storage**: Go to "Build" > "Storage" and click **Get Started**. Set your rules to "Test Mode" initially so the app can upload without complex authentication.
- **Messaging**: Go to "Project Settings" > "Cloud Messaging" to ensure it's enabled.

---

## 3. Building and Running

### Step 4: Build Web Assets
Convert the React code into static files:
```powershell
npm run build
```

### Step 5: Sync with Capacitor
Push the web code and plugin configurations into the Android project:
```powershell
npx cap sync android
```

### Step 6: Launch Android Studio
Open the project in Android Studio:
```powershell
npx cap open android
```

### Step 7: Run on Device
1.  Connect a physical Android device via USB (recommended for Push Notifications).
2.  Enable **USB Debugging** on the device.
3.  In Android Studio, click the **Green Play Button** at the top right.

---

## 4. How to Test the Cloud Service

1.  **Launch the App**: Once running on your phone, navigate to **New Claim**.
2.  **Notification Permission**: A prompt will appear asking to "Allow AIVALA to send notifications". Click **Allow**.
3.  **Record Video**: Record a 10-second video of a car or object and click **Continue**.
4.  **The Upload Phase**:
    - The screen will say **"Uploading to Secure Cloud"**.
    - Watch the progress bar; it reflects the real-time upload to Firebase Storage.
5.  **Completion Notification**:
    - Once the progress bar hits the upload mark, you should receive a **System Notification** saying **"Upload Complete: Claim CLM-XXXX has been successfully uploaded."**
6.  **Verify in Firebase**:
    - Go to your Firebase Console > **Storage**.
    - You should see a new folder named `claims/` containing your `.mp4` video.

---

## Troubleshooting
- **Build Error**: If you get a "google-services.json missing" error, ensure the file is exactly in the `android/app/` folder.
- **Notification Not Appearing**: Ensure your phone is connected to the internet and that you accepted the permission prompt.
- **Upload Failing**: Check the Firebase Storage Rules. They should allow "write" access for testing.
