import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function ProcessingScreen() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { name: 'Extracting Video Frames', desc: 'Analyzing video content' },
    { name: 'Face Detection', desc: 'Verifying identity' },
    { name: 'Damage Analysis', desc: 'AI assessing damage' },
    { name: 'Fraud Scoring', desc: 'Running fraud checks' },
    { name: 'Cost Estimation', desc: 'Calculating claim value' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate(`/app/results/${claimId}`), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [claimId, navigate]);

  useEffect(() => {
    const step = Math.floor((progress / 100) * steps.length);
    setCurrentStep(step);
  }, [progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="h-16 w-16 text-blue-600" />
          </motion.div>
          <h1 className="text-2xl mb-2">Processing Your Claim</h1>
          <p className="text-gray-600">Claim ID: {claimId}</p>
          <p className="text-sm text-gray-500 mt-2">Estimated time: 5-10 minutes</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-1 ${index < currentStep ? 'text-green-500' : index === currentStep ? 'text-blue-600' : 'text-gray-300'}`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="h-5 w-5 border-2 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`${index <= currentStep ? 'font-medium' : 'text-gray-400'}`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                    {index === currentStep && (
                      <Progress value={(progress % 20) * 5} className="h-1 mt-2" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-sm text-gray-700">
            <strong>AI is analyzing:</strong> Your identity, damage extent, fraud indicators, and calculating fair settlement value
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
