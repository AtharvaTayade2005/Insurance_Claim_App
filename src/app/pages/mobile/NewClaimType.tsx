import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Car, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useNetworkStatus } from "@/app/utils/networkStatus";
import { Wifi, WifiOff } from "lucide-react";

export default function NewClaimType() {
  const navigate = useNavigate();
  const networkStatus = useNetworkStatus();

  const claimTypes = [
    { id: 'auto', name: 'Auto Insurance', icon: Car, color: 'blue', desc: 'Vehicle damage or accident claims' },
    { id: 'property', name: 'Property Insurance', icon: Home, color: 'green', desc: 'Home or property damage claims' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl">New Claim</h1>
          <p className="text-gray-500 text-sm">Select claim type</p>
        </div>
        <Badge variant={networkStatus.isOnline ? "default" : "secondary"} className="gap-1">
          {networkStatus.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {networkStatus.isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      <div className="space-y-4">
        {claimTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => navigate("/app/video-recording")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-${type.color}-100 p-4 rounded-xl`}>
                    <Icon className={`h-8 w-8 text-${type.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                    <div className="mt-3 flex items-center text-blue-600 text-sm">
                      <span>Start claim →</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Most claims are processed within 5-10 minutes using AI verification.
            {!networkStatus.isOnline && ' You can record offline - claim will upload automatically when online.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}