import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { ArrowLeft, FileText, Search, Download } from "lucide-react";
import { mockClaims } from "@/app/data/mockData";

export default function ClaimsHistory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/app/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl">Claims History</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search claims..." className="pl-10" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {mockClaims.map((claim) => (
          <Card key={claim.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{claim.id}</div>
                    <div className="text-sm text-gray-600">{claim.type.charAt(0).toUpperCase() + claim.type.slice(1)} Insurance</div>
                  </div>
                </div>
                <Badge 
                  variant={claim.status === 'approved' ? 'default' : claim.status === 'pending' ? 'secondary' : 'destructive'}
                  className={
                    claim.status === 'approved' ? 'bg-green-500' : 
                    claim.status === 'pending' ? 'bg-yellow-500' : 
                    claim.status === 'flagged' ? 'bg-orange-500' : 'bg-red-500'
                  }
                >
                  {claim.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">₹{claim.estimatedCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fraud Score</p>
                  <p className={`font-medium ${claim.fraudScore < 30 ? 'text-green-600' : claim.fraudScore < 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {claim.fraudScore}%
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-20 right-4">
        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
