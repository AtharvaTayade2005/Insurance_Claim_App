import { useNavigate, useParams } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { CheckCircle, AlertTriangle, TrendingDown, Eye, ArrowRight, Home } from "lucide-react";
import { fraudLayers } from "@/app/data/mockData";

export default function ResultsScreen() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const fraudScore = 15;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-12 w-12" />
          <div>
            <h1 className="text-2xl">Claim Approved!</h1>
            <p className="text-green-100 text-sm">ID: {claimId}</p>
          </div>
        </div>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm">Estimated Settlement</p>
                <p className="text-3xl">₹45,000</p>
              </div>
              <Badge className="bg-white text-green-600">
                Low Risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-4">
        {/* Fraud Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg mb-1">Fraud Risk Score</h3>
                <p className="text-sm text-gray-500">AI-powered analysis</p>
              </div>
              <div className="text-right">
                <div className="text-3xl text-green-600">{fraudScore}%</div>
                <div className="text-xs text-gray-500">Confidence: 98%</div>
              </div>
            </div>
            
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                style={{ width: `${fraudScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Low Risk</span>
              <span>Medium</span>
              <span>High Risk</span>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Analysis Layers */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Analysis Breakdown
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {fraudLayers.map((layer, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="text-sm">{layer.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{layer.score}%</span>
                        <Badge variant={layer.confidence === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {layer.confidence}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600">
                    {layer.details}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Damage Assessment */}
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-2">Damage Assessment</h3>
            <p className="text-sm text-gray-600 mb-3">Front bumper damage, minor scratches</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/app/damage/${claimId}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Detailed Analysis
            </Button>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Parts</span>
                <span>₹28,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Labor</span>
                <span>₹12,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inspection</span>
                <span>₹5,000</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Estimate</span>
                <span className="text-blue-600">₹45,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              Next Steps
            </h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>✓ Claim verified and approved</li>
              <li>• Choose settlement option</li>
              <li>• Schedule repair appointment</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/app/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/app/settlement/${claimId}`)}>
            Choose Settlement <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
