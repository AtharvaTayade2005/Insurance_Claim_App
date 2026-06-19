import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import { VideoRecorder, VideoRecorderCamera, VideoRecorderQuality } from "@capacitor-community/video-recorder";
import { Filesystem } from "@capacitor/filesystem";
import { FirebaseFirestore } from "@capacitor-firebase/firestore";
import { Capacitor } from "@capacitor/core";

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

import { offlineStorage, OfflineClaim } from "@/app/utils/offlineStorage";
import { syncManager } from "@/app/utils/syncManager";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

const MAX_FILE_SIZE_MB = 50;

export default function VideoRecording() {
  const navigate = useNavigate();
  const networkStatus = useNetworkStatus();

  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const isWeb = Capacitor.getPlatform() === "web";
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop streams and timers on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Handle web stream source setting
  useEffect(() => {
    if (isWeb && videoRef.current && stream && !recorded) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isWeb, recorded]);

  // 🚀 START RECORDING
  const startRecording = async () => {
    try {
      // reset
      setVideoUrl(null);
      setVideoSize(null);
      setRecorded(false);
      setProgress(0);
      chunksRef.current = [];

      if (isWeb) {
        console.log("Initializing web video recorder...");
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          });
        } catch (err) {
          console.warn("Could not access camera with audio, trying video-only:", err);
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        }

        setStream(mediaStream);

        let recorder: MediaRecorder;
        const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"];
        let selectedMimeType = "";
        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            selectedMimeType = type;
            break;
          }
        }

        if (selectedMimeType) {
          recorder = new MediaRecorder(mediaStream, { mimeType: selectedMimeType });
        } else {
          recorder = new MediaRecorder(mediaStream);
        }

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.start(1000);
        setRecording(true);

        let value = 0;
        progressInterval.current = setInterval(() => {
          value += 1;
          setProgress(value);

          if (value >= 100) {
            stopRecording();
          }
        }, 1000);

        toast.success("Recording started");
      } else {
        // Native Capawesome Recorder
        await VideoRecorder.initialize({
          camera: VideoRecorderCamera.BACK,
          quality: VideoRecorderQuality.MAX_720P,
          previewFrames: [
            {
              id: "video-area",
              stackPosition: "back",
              width: "fill",
              height: "fill",
              x: 0,
              y: 0,
              borderRadius: 0
            }
          ]
        });

        await VideoRecorder.startRecording();
        setRecording(true);

        let value = 0;
        progressInterval.current = setInterval(() => {
          value += 1;
          setProgress(value);

          if (value >= 100) {
            stopRecording();
          }
        }, 1000);

        toast.success("Recording started");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to start recording. Verify camera permissions.");
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = async () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    try {
      if (isWeb) {
        const recorder = mediaRecorderRef.current;
        if (!recorder || recorder.state === "inactive") {
          toast.error("No active recording found");
          return;
        }

        await new Promise<void>((resolve) => {
          if (recorder) {
            recorder.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
              const url = URL.createObjectURL(blob);
              const sizeInMb = blob.size / (1024 * 1024);

              setVideoSize(sizeInMb);
              setRecording(false);
              setRecorded(true);

              if (sizeInMb > MAX_FILE_SIZE_MB) {
                toast.error(`Video too large (${sizeInMb.toFixed(1)}MB). Limit is ${MAX_FILE_SIZE_MB}MB.`);
              } else {
                setVideoUrl(url);
                toast.success("Video captured successfully");
              }
              resolve();
            };
            recorder.stop();
          } else {
            resolve();
          }
        });

        // Turn off camera tracks
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      } else {
        // Native Capawesome Recorder
        const result = await VideoRecorder.stopRecording();
        setRecording(false);
        setRecorded(true);

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
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to stop recording");
    }
  };

  // 🔄 RETAKE
  const handleRetake = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setVideoUrl(null);
    setVideoSize(null);
    setRecorded(false);
    setRecording(false);
    setProgress(0);
    toast.success("Ready to retake");
  };

  // 🚀 CONTINUE + SAVE CLAIM
  const handleContinue = async () => {
    if (!videoUrl) {
      toast.error("Please capture video first");
      return;
    }

    if (videoSize && videoSize > MAX_FILE_SIZE_MB) {
      toast.error("File exceeds size limit. Please retake.");
      return;
    }

    try {
      setIsUploading(true);
      const claimId = `CLM-${Date.now()}`;

      toast.loading("Syncing evidence log with Google Cloud...");

      // 🔥 Cloud Sync Firestore (Non-blocking)
      try {
        if (isWeb) {
          if (db) {
            await addDoc(collection(db, "evidence_logs"), {
              claimId: claimId,
              status: "Video Captured",
              timestamp: new Date().toISOString(),
              location: "Mobile Evidence Collection",
              type: "Auto Insurance"
            });
            console.log("Firestore evidence log created successfully.");
          } else {
            console.warn("Firestore not configured, skipping web Firestore doc creation.");
          }
        } else {
          await FirebaseFirestore.addDocument({
            reference: "evidence_logs",
            data: {
              claimId: claimId,
              status: "Video Captured",
              timestamp: new Date().toISOString(),
              location: "Mobile Evidence Collection",
              type: "Auto Insurance"
            }
          });
          console.log("Capacitor Firestore evidence log created successfully.");
        }
      } catch (dbError) {
        console.warn("Firestore database write failed (possibly due to rules or setup), but continuing with GCS upload:", dbError);
      }

      // Prepare claim object to queue for cloud sync (GCS upload)
      const newClaimData: OfflineClaim = {
        id: claimId,
        type: 'auto',
        status: 'pending_upload',
        videoBlob: videoUrl,
        claimData: {
          description: "Auto Insurance Claim Video Evidence",
          location: "Mobile Evidence Collection"
        },
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        size: videoSize ? Math.round(videoSize * 1024 * 1024) : 0
      };

      // Save offline claim to the storage manager (which queues it)
      offlineStorage.saveClaim(newClaimData);

      // Save to claims history local array
      const existingClaims = JSON.parse(localStorage.getItem("claims") || "[]");
      const claimsListItem = {
        id: claimId,
        type: "Auto",
        status: "processing",
        date: "Just now",
        videoUrl: videoUrl,
        createdAt: new Date().toISOString(),
      };
      existingClaims.unshift(claimsListItem);
      localStorage.setItem("claims", JSON.stringify(existingClaims));

      // Trigger standard sync now
      syncManager.syncNow();

      toast.dismiss();
      toast.success("Cloud Sync Initiated!");
      navigate(`/app/processing/${claimId}`);
    } catch (error) {
      console.error("Cloud Sync error:", error);
      toast.dismiss();
      toast.error("Cloud sync failed. Data saved locally.");
      navigate(`/app/processing/CLM-LOCAL`);
    } finally {
      setIsUploading(false);
    }
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
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
        {isWeb ? (
          (recording && stream) || (recorded && videoUrl) ? (
            <video
              ref={videoRef}
              src={recorded && videoUrl ? videoUrl : undefined}
              autoPlay={recording}
              playsInline
              muted={recording}
              controls={recorded}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-4 text-center">
              <Video className="h-12 w-12 mb-2 animate-pulse text-red-500" />
              <p className="text-sm font-medium">Camera Inactive</p>
              <p className="text-xs text-white/30 mt-1">Tap record below to initialize your camera.</p>
            </div>
          )
        ) : (
          <div id="video-area" className="w-full h-full" />
        )}

        {/* RECORDING UI OVERLAY */}
        {recording && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-2 rounded-full flex items-center gap-2 z-50">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Recording... {progress}s
            </span>
          </div>
        )}

        {recorded && videoUrl && (
           <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center pointer-events-none">
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
      <div className="p-6 pb-8 bg-black">
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
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
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
