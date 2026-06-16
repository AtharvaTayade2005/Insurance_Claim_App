import { useState } from "react";
import { useNavigate } from "react-router";

import { CameraPreview } from "@capacitor-community/camera-preview";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

import {
  ArrowLeft,
  Camera,
  RotateCw,
  Check,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";

import { Progress } from "@/app/components/ui/progress";
import { useNetworkStatus } from "@/app/utils/networkStatus";
import { toast } from "sonner";

export default function VideoRecording() {

  const navigate = useNavigate();
  const networkStatus = useNetworkStatus();

  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [progress, setProgress] = useState(0);

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  // 🚀 START CAMERA
  const startRecording = async () => {

    try {

      // reset
      setCapturedImage(null);
      setRecorded(false);
      setProgress(0);

      // start camera
      await CameraPreview.start({
        parent: "cameraPreview",
        className: "camera-preview",
        position: "rear",
        toBack: false,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      setRecording(true);

      let value = 0;

      const interval = setInterval(async () => {

        value += 5;

        setProgress(value);

        // auto capture
        if (value >= 100) {

          clearInterval(interval);

          try {

            // capture image
            const result = await CameraPreview.capture({
              quality: 90,
            });

            // stop camera
            await CameraPreview.stop();

            // convert image
            const imagePath =
              `data:image/jpeg;base64,${result.value}`;

            // save image state
            setCapturedImage(imagePath);

            // local save
            localStorage.setItem(
              "claimCapture",
              imagePath
            );

            setRecording(false);
            setRecorded(true);

            toast.success(
              "Claim captured successfully"
            );

          } catch (error) {

            console.error(error);

            toast.error(
              "Failed to capture image"
            );
          }
        }

      }, 300);

      toast.success("Camera started");

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to open camera"
      );
    }
  };

  // 🔄 RETAKE
  const handleRetake = async () => {

    try {

      await CameraPreview.stop();

    } catch (error) {}

    setCapturedImage(null);
    setRecorded(false);
    setRecording(false);
    setProgress(0);

    toast.success("Ready to retake");
  };

  // 🚀 CONTINUE + SAVE CLAIM
  const handleContinue = () => {

    if (!capturedImage) {

      toast.error(
        "Please capture image first"
      );

      return;
    }

    // old claims
    const existingClaims =
      JSON.parse(localStorage.getItem("claims") || "[]");

    // new claim
    const newClaim = {

      id: `CLM-${Date.now()}`,

      type: "Auto",

      status: "processing",

      date: "Just now",

      image: capturedImage,

      createdAt: new Date().toISOString(),
    };

    // add newest first
    existingClaims.unshift(newClaim);

    // save claims
    localStorage.setItem(
      "claims",
      JSON.stringify(existingClaims)
    );

    toast.success("Claim submitted");

    navigate("/app/dashboard");
  };

  return (

    <div className="min-h-screen bg-black flex flex-col">

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/70 to-transparent">

        <div className="flex justify-between items-center text-white">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/new-claim")}
          >

            <ArrowLeft className="h-6 w-6" />

          </Button>

          <span className="text-sm">
            Auto Insurance
          </span>

          <Badge
            variant={networkStatus.isOnline ? "default" : "secondary"}
          >

            {networkStatus.isOnline ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </>
            )}

          </Badge>

        </div>

      </div>

      {/* CAMERA AREA */}
      <div className="flex-1 bg-black relative">

        {!capturedImage ? (

          <div
            id="cameraPreview"
            className="w-full h-full"
          />

        ) : (

          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />

        )}

        {/* RECORDING UI */}
        {recording && (

          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-2 rounded-full flex items-center gap-2 z-50">

            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />

            <span className="text-white text-sm">
              Processing Claim...
            </span>

          </div>

        )}

      </div>

      {/* INSTRUCTIONS */}
      <div className="absolute bottom-32 left-0 right-0 px-6">

        <Card className="bg-black/70 text-white border-white/20">

          <div className="p-4 space-y-2">

            <p className="text-sm">
              • Show your face clearly
            </p>

            <p className="text-sm">
              • Show vehicle damage
            </p>

            <p className="text-sm">
              • Keep camera stable
            </p>

            {!networkStatus.isOnline && (

              <div className="flex items-center gap-2 pt-2 border-t border-white/20">

                <AlertCircle className="h-4 w-4 text-orange-400" />

                <p className="text-xs text-orange-300">
                  Offline mode active
                </p>

              </div>

            )}

          </div>

        </Card>

      </div>

      {/* CONTROLS */}
      <div className="p-6 pb-8">

        {progress > 0 && recording && (
          <Progress value={progress} className="mb-4" />
        )}

        <div className="flex gap-4 justify-center">

          {/* START */}
          {!recording && !recorded && (

            <Button
              size="icon"
              className="h-20 w-20 rounded-full bg-red-500"
              onClick={startRecording}
            >

              <Camera className="h-8 w-8 text-white" />

            </Button>

          )}

          {/* AFTER CAPTURE */}
          {!recording && recorded && (

            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRetake}
              >

                <RotateCw className="mr-2 h-4 w-4" />

                Retake

              </Button>

              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={handleContinue}
              >

                <Check className="mr-2 h-4 w-4" />

                Continue

              </Button>

            </>

          )}

        </div>

      </div>

    </div>
  );
}