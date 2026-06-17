import { useState, useRef } from "react";
import { useNavigate } from "react-router";

import { VideoRecorder } from "@capacitor-community/video-recorder";
import { Filesystem } from "@capacitor/filesystem";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

import {
  ArrowLeft,
  Video,
  RotateCw,
  Check,
  Wifi,
  WifiOff,
  AlertCircle,
  Square,
} from "lucide-react";

import { Progress } from "@/app/components/ui/progress";
import { useNetworkStatus } from "@/app/utils/networkStatus";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 50;

export default function VideoRecording() {

  const navigate = useNavigate();
  const networkStatus = useNetworkStatus();

  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoSize, setVideoSize] = useState<number | null>(null);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // 🚀 START RECORDING
  const startRecording = async () => {

    try {
      // Initialize video recorder
      await VideoRecorder.initialize({
        id: "video-area",
      });

      // reset
      setVideoUrl(null);
      setVideoSize(null);
      setRecorded(false);
      setProgress(0);

      await VideoRecorder.start();
      setRecording(true);

      let value = 0;
      progressInterval.current = setInterval(() => {
        value += 1;
        setProgress(value);

        // Auto stop after 100 seconds if not manually stopped
        if (value >= 100) {
          stopRecording();
        }
      }, 1000);

      toast.success("Recording started");

    } catch (error) {
      console.error(error);
      toast.error("Failed to start recording");
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = async () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    try {
      const result = await VideoRecorder.stop();
      setRecording(false);
      setRecorded(true);

      // Get file size
      try {
        const fileInfo = await Filesystem.getStat({
          path: result.videoUrl
        });

        const sizeInMb = fileInfo.size / (1024 * 1024);
        setVideoSize(sizeInMb);

        if (sizeInMb > MAX_FILE_SIZE_MB) {
          toast.error(`Video too large (${sizeInMb.toFixed(1)}MB). Limit is ${MAX_FILE_SIZE_MB}MB.`);
        } else {
          setVideoUrl(result.videoUrl);
          toast.success("Video captured successfully");
        }
      } catch (sizeError) {
        console.error("Error checking file size:", sizeError);
        setVideoUrl(result.videoUrl); // Fallback if size check fails
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to stop recording");
    }
  };

  // 🔄 RETAKE
  const handleRetake = () => {
    setVideoUrl(null);
    setVideoSize(null);
    setRecorded(false);
    setRecording(false);
    setProgress(0);
    toast.success("Ready to retake");
  };

  // 🚀 CONTINUE + SAVE CLAIM
  const handleContinue = () => {

    if (!videoUrl) {
      toast.error("Please capture video first");
      return;
    }

    if (videoSize && videoSize > MAX_FILE_SIZE_MB) {
      toast.error("File exceeds size limit. Please retake.");
      return;
    }

    // old claims
    const existingClaims = JSON.parse(localStorage.getItem("claims") || "[]");

    // new claim
    const claimId = `CLM-${Date.now()}`;
    const newClaim = {
      id: claimId,
      type: "Auto",
      status: "processing",
      date: "Just now",
      videoUrl: videoUrl,
      createdAt: new Date().toISOString(),
    };

    // add newest first
    existingClaims.unshift(newClaim);

    // save claims
    localStorage.setItem("claims", JSON.stringify(existingClaims));

    toast.success("Claim submitted");

    navigate(`/app/processing/${claimId}`);
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
            Auto Insurance - Video Evidence
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
        <div id="video-area" className="w-full h-full" />

        {/* RECORDING UI */}
        {recording && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-2 rounded-full flex items-center gap-2 z-50">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Recording... {progress}s
            </span>
          </div>
        )}

        {recorded && videoUrl && (
           <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center">
              <div className="text-white text-center">
                <Check className="h-16 w-16 text-green-500 mx-auto mb-2" />
                <p className="font-bold">Video Recorded</p>
                {videoSize && <p className="text-sm">Size: {videoSize.toFixed(1)} MB</p>}
              </div>
           </div>
        )}
      </div>

      {/* INSTRUCTIONS */}
      <div className="absolute bottom-32 left-0 right-0 px-6">

        <Card className="bg-black/70 text-white border-white/20">

          <div className="p-4 space-y-2">
            <p className="text-sm">• Walk around the vehicle slowly</p>
            <p className="text-sm">• Focus on the damaged areas</p>
            <p className="text-sm">• Ensure license plate is visible</p>

            {videoSize && videoSize > MAX_FILE_SIZE_MB && (
               <div className="flex items-center gap-2 pt-2 border-t border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-xs text-red-300">File exceeds 50MB limit!</p>
              </div>
            )}
          </div>

        </Card>

      </div>

      {/* CONTROLS */}
      <div className="p-6 pb-8">

        {recording && (
          <Progress value={progress} className="mb-4 bg-white/20" />
        )}

        <div className="flex gap-4 justify-center">

          {/* START */}
          {!recording && !recorded && (
            <Button
              size="icon"
              className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white"
              onClick={startRecording}
            >
              <Video className="h-8 w-8 text-white" />
            </Button>
          )}

          {/* STOP */}
          {recording && (
            <Button
              size="icon"
              className="h-20 w-20 rounded-full bg-white hover:bg-gray-100"
              onClick={stopRecording}
            >
              <Square className="h-8 w-8 text-red-600" />
            </Button>
          )}

          {/* AFTER CAPTURE */}
          {!recording && recorded && (
            <>
              <Button
                variant="outline"
                className="flex-1 text-white border-white/30 hover:bg-white/10"
                onClick={handleRetake}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Retake
              </Button>

              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled={!!videoSize && videoSize > MAX_FILE_SIZE_MB}
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
