import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Shield, Brain } from "lucide-react";

export default function WebLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-16 w-16" />
            <Brain className="h-12 w-12 text-green-400" />
          </div>
          <h1 className="text-4xl mb-2">AIVALA</h1>
          <p className="text-blue-200">Insurer Dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Insurer Login</CardTitle>
            <CardDescription>Access your claims management dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="agent">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Claims Agent</SelectItem>
                  <SelectItem value="manager">Claims Manager</SelectItem>
                  <SelectItem value="admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="your@company.com" />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full" onClick={() => navigate("/web/dashboard")}>
              Sign In
            </Button>

            <div className="text-center">
              <button className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button variant="ghost" className="text-white" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
