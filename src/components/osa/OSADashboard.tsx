import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Users,
  Award,
  TrendingUp,
  Download,
  CheckCircle2,
  Star,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { sessionService, userService } from "../../services/api";

export function OSADashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalCredits: 0,
    eligibleScholarships: 0,
    avgScore: 0,
  });

  useEffect(() => {
    loadOSAData();
  }, []);

  const loadOSAData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load OSA data from API when backend implements it
      // For now, show empty state
      setStats({
        totalParticipants: 0,
        totalCredits: 0,
        eligibleScholarships: 0,
        avgScore: 0,
      });
      toast.info("OSA API not yet implemented");
    } catch (error) {
      console.error("Failed to load OSA data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (reportType: string) => {
    toast.info("Download functionality", {
      description: `${reportType} report download will be available when API is implemented`,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading OSA data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Office of Student Affairs
        </h1>
        <p className="text-gray-600">
          Student participation tracking and evaluation for training credits and
          scholarships
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-cyan-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm mb-1 font-medium">
                  Total Participants
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.totalParticipants}
                </p>
                <p className="text-xs text-gray-600 mt-2">This semester</p>
              </div>
              <Users className="w-12 h-12 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm mb-1 font-medium">
                  Training Credits Awarded
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.totalCredits}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  To students
                </p>
              </div>
              <Award className="w-12 h-12 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm mb-1 font-medium">
                  Scholarship Eligible
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.eligibleScholarships}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Based on performance
                </p>
              </div>
              <Trophy className="w-12 h-12 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm mb-1 font-medium">
                  Avg Evaluation Score
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.avgScore.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600 mt-2">Out of 5.0</p>
              </div>
              <Star className="w-12 h-12 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Reports Coming Soon
            </h3>
            <p className="text-gray-500 mb-4">
              Detailed analytics and reports will be available once the OSA API is implemented
            </p>
            <p className="text-sm text-gray-400">
              • Student Participation Analysis<br />
              • Training Credits Report<br />
              • Scholarship Eligibility<br />
              • Evaluation Outcomes
            </p>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
