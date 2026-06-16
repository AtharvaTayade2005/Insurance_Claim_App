import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent } from "@/app/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Upload } from "lucide-react";

export default function ClaimDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    vehicle: "",
    description: ""
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/video-recording")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl">Claim Details</h1>
          <p className="text-sm text-gray-500">Provide incident information</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Incident Date & Time
          </Label>
          <Input 
            type="datetime-local" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input 
            placeholder="E.g., Mumbai, Maharashtra"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Vehicle/Property Details</Label>
          <Input 
            placeholder="E.g., Honda City 2020, MH-02-XX-1234"
            value={formData.vehicle}
            onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Description of Incident</Label>
          <Textarea 
            placeholder="Describe what happened..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Police Report (Optional)</p>
            <Button variant="outline" size="sm">Upload Document</Button>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
        <Button className="w-full" size="lg" onClick={() => navigate("/app/claim-submission")}>
          Review & Submit
        </Button>
      </div>
    </div>
  );
}
