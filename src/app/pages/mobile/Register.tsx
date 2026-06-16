import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Shield, Upload, Lock, Eye } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToFaceVisibility, setAgreedToFaceVisibility] = useState(false);

  const canRegister = agreedToTerms && agreedToFaceVisibility;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-6 flex flex-col justify-center">
      <div className="mb-6 text-center text-white">
        <Shield className="h-12 w-12 mx-auto mb-3" />
        <h1 className="text-2xl">Create Account</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Multi-step registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Upload Insurance Card</p>
            <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
          </div>

          {/* Privacy Consent */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-start gap-2">
              <Checkbox 
                id="faceConsent" 
                checked={agreedToFaceVisibility}
                onCheckedChange={(checked) => setAgreedToFaceVisibility(checked as boolean)}
              />
              <label htmlFor="faceConsent" className="text-xs text-gray-700 leading-tight">
                <Eye className="h-3 w-3 inline mr-1" />
                I understand that my <strong>face must be clearly visible</strong> in claim videos for authentication and fraud prevention purposes.
              </label>
            </div>
            
            <div className="flex items-start gap-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-xs text-gray-700 leading-tight">
                <Lock className="h-3 w-3 inline mr-1" />
                I agree to AIVALA's privacy policy. I understand that:
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>All video data is encrypted end-to-end</li>
                  <li>Raw videos are automatically deleted after processing (within 24 hours)</li>
                  <li>Only extracted frames are retained for claim records</li>
                  <li>I can request deletion of my data at any time</li>
                </ul>
              </label>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => navigate("/app/dashboard")}
            disabled={!canRegister}
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}