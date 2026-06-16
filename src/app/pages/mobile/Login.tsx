import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Fingerprint, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("hdfc");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const userData = {
      name: email.split("@")[0] || "User",
      email: email,
      provider: provider,
      phone: "Not added yet",
      id: "USR-" + Date.now(),
      loggedIn: true,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-6 flex flex-col justify-center">

      <div className="mb-8 text-center text-white">
        <Shield className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-3xl mb-2">Welcome Back</h1>
        <p className="text-blue-100">Login to your AIVALA account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Insurance Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hdfc">HDFC ERGO</SelectItem>
                <SelectItem value="icici">ICICI Lombard</SelectItem>
                <SelectItem value="sbi">SBI General</SelectItem>
                <SelectItem value="bajaj">Bajaj Allianz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>

          <Button variant="outline" className="w-full" onClick={handleLogin}>
            <Fingerprint className="mr-2 h-4 w-4" />
            Biometric Login
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
