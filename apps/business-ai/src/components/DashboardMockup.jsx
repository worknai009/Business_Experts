import {
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-xl">

      {/* Glow */}
      <div className="absolute -inset-8 rounded-full bg-blue-400/20 blur-3xl"></div>

      <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl">
        <CardContent className="p-7">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                AI Analysis
              </h3>

              <p className="text-sm text-slate-500">
                Business Opportunity Report
              </p>
            </div>

            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Ready
            </Badge>
          </div>

          {/* Main Score */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-80">
                  Overall Score
                </p>

                <h2 className="mt-2 text-6xl font-bold">
                  91%
                </h2>

                <p className="mt-2 opacity-80">
                  Excellent Growth Potential
                </p>
              </div>

              <TrendingUp className="h-14 w-14 opacity-90" />

            </div>

            {/* Progress */}
            <div className="mt-6 h-3 rounded-full bg-white/20">
              <div className="h-3 w-[91%] rounded-full bg-white"></div>
            </div>

          </div>

          {/* KPI Cards */}

          <div className="mt-6 grid grid-cols-2 gap-4">

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <Activity className="mb-3 h-6 w-6 text-green-600" />
                <p className="text-sm text-slate-500">
                  Market Demand
                </p>
                <h4 className="mt-2 text-2xl font-bold text-green-600">
                  High
                </h4>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <ShieldCheck className="mb-3 h-6 w-6 text-orange-500" />
                <p className="text-sm text-slate-500">
                  Competition
                </p>
                <h4 className="mt-2 text-2xl font-bold text-orange-500">
                  Medium
                </h4>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <IndianRupee className="mb-3 h-6 w-6 text-blue-600" />
                <p className="text-sm text-slate-500">
                  Investment
                </p>
                <h4 className="mt-2 text-2xl font-bold">
                  ₹2L
                </h4>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <TrendingUp className="mb-3 h-6 w-6 text-indigo-600" />
                <p className="text-sm text-slate-500">
                  ROI
                </p>
                <h4 className="mt-2 text-2xl font-bold text-indigo-600">
                  18 Months
                </h4>
              </CardContent>
            </Card>

          </div>

          {/* AI Suggestions */}

          <Card className="mt-6 rounded-2xl border-blue-100 bg-blue-50">
            <CardContent className="p-5">

              <h4 className="mb-4 text-lg font-bold">
                AI Suggestions
              </h4>

              <div className="space-y-3">

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Strong market demand detected.</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Competition level is manageable.</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Estimated break-even within 18 months.</span>
                </div>

              </div>

            </CardContent>
          </Card>

        </CardContent>
      </Card>

    </div>
  );
}

export default DashboardMockup;