import { useNavigate, useParams } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Car } from "lucide-react";
import { damageAreas } from "@/app/data/mockData";

export default function DamageDetails() {
  const { claimId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/app/results/${claimId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl">Damage Analysis</h1>
          <p className="text-sm text-gray-500">AI-detected damage areas</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <Car className="h-32 w-32 text-gray-400" />
              {damageAreas.map((area) => (
                <div
                  key={area.id}
                  className="absolute border-4 border-red-500 rounded"
                  style={{
                    left: `${area.coordinates.x}%`,
                    top: `${area.coordinates.y}%`,
                    width: `${area.coordinates.width}%`,
                    height: `${area.coordinates.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {area.id}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click on highlighted areas for details
            </p>
          </CardContent>
        </Card>

        {damageAreas.map((area) => (
          <Card key={area.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive">{area.id}</Badge>
                    <h3 className="font-medium">{area.type}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Confidence: {area.confidence}%</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{area.cost.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Est. cost</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Severity</span>
                    <span>{area.severity}/10</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${area.severity > 7 ? 'bg-red-500' : area.severity > 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${area.severity * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
