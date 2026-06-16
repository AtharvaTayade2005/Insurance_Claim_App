import { useNavigate } from "react-router";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
} from "@/app/components/ui/card";

import { Badge } from "@/app/components/ui/badge";

import {
  PlusCircle,
  FileText,
  User,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  // ✅ GET USER
  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ GET CLAIMS
  const recentClaims =
    JSON.parse(localStorage.getItem("claims") || "[]");

  // counts
  const pendingCount =
    recentClaims.filter(
      (c: any) =>
        c.status === "processing"
    ).length;

  const approvedCount =
    recentClaims.filter(
      (c: any) =>
        c.status === "approved"
    ).length;

  const rejectedCount =
    recentClaims.filter(
      (c: any) =>
        c.status === "rejected"
    ).length;

  return (

    <div className="min-h-screen bg-gray-50 pb-20">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">

        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-2xl mb-1">
              Welcome,
              {" "}
              {user?.name || "User"}
            </h1>

            <p className="text-blue-100">
              {user?.provider || "Insurance"}
            </p>

          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() =>
              navigate("/app/settings")
            }
          >

            <Settings className="h-6 w-6" />

          </Button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">

          <Card className="bg-white/10 border-white/20">

            <CardContent className="p-4 text-center">

              <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-300" />

              <div className="text-2xl">
                {pendingCount}
              </div>

              <div className="text-xs text-blue-100">
                Pending
              </div>

            </CardContent>

          </Card>

          <Card className="bg-white/10 border-white/20">

            <CardContent className="p-4 text-center">

              <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-300" />

              <div className="text-2xl">
                {approvedCount}
              </div>

              <div className="text-xs text-blue-100">
                Approved
              </div>

            </CardContent>

          </Card>

          <Card className="bg-white/10 border-white/20">

            <CardContent className="p-4 text-center">

              <XCircle className="h-5 w-5 mx-auto mb-1 text-red-300" />

              <div className="text-2xl">
                {rejectedCount}
              </div>

              <div className="text-xs text-blue-100">
                Rejected
              </div>

            </CardContent>

          </Card>

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">

        {/* NEW CLAIM */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">

          <CardContent className="p-6">

            <h3 className="text-xl mb-2">
              New Insurance Claim
            </h3>

            <p className="text-green-100 mb-4 text-sm">
              Quick AI-powered verification
            </p>

            <Button
              className="w-full bg-white text-green-600 hover:bg-green-50"
              onClick={() =>
                navigate("/app/new-claim")
              }
            >

              <PlusCircle className="mr-2 h-5 w-5" />

              Start New Claim

            </Button>

          </CardContent>

        </Card>

        {/* RECENT CLAIMS */}
        <div className="mt-6">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg">
              Recent Claims
            </h2>

          </div>

          <div className="space-y-4">

            {recentClaims.length === 0 ? (

              <Card className="p-6 text-center">

                <p className="text-gray-500">
                  No claims submitted yet
                </p>

              </Card>

            ) : (

              recentClaims.map(
                (claim: any) => (

                  <Card
                    key={claim.id}
                    className="overflow-hidden"
                  >

                    {/* IMAGE */}
                    {claim.image && (

                      <img
                        src={claim.image}
                        alt="Claim"
                        className="w-full h-48 object-cover"
                      />

                    )}

                    <CardContent className="p-4">

                      <div className="flex justify-between items-start">

                        <div className="flex items-start gap-3">

                          <div className="bg-blue-100 p-2 rounded-lg">

                            <FileText className="h-5 w-5 text-blue-600" />

                          </div>

                          <div>

                            <div className="font-medium">
                              {claim.id}
                            </div>

                            <div className="text-sm text-gray-500">
                              {claim.type} Insurance
                            </div>

                            <div className="text-xs text-gray-400 mt-1">
                              {claim.date}
                            </div>

                          </div>

                        </div>

                        <Badge className="bg-yellow-500">

                          {claim.status}

                        </Badge>

                      </div>

                    </CardContent>

                  </Card>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-md mx-auto">

        <div className="grid grid-cols-4 p-2">

          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
          >

            <FileText className="h-5 w-5 mb-1" />

            <span className="text-xs">
              Claims
            </span>

          </Button>

          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
          >

            <Clock className="h-5 w-5 mb-1" />

            <span className="text-xs">
              History
            </span>

          </Button>

          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
            onClick={() =>
              navigate("/app/profile")
            }
          >

            <User className="h-5 w-5 mb-1" />

            <span className="text-xs">
              Profile
            </span>

          </Button>

          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
            onClick={() =>
              navigate("/app/settings")
            }
          >

            <Settings className="h-5 w-5 mb-1" />

            <span className="text-xs">
              Settings
            </span>

          </Button>

        </div>

      </div>

    </div>
  );
}