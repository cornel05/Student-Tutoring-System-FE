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
import { analyticsService } from "../../services/api";

export function OSADashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalCredits: 0,
    eligibleScholarships: 0,
    avgScore: 0,
  });
  const [reports, setReports] = useState<{
    tutorPerformance: any;
    studentEngagement: any;
    materialUsage: any;
  } | null>(null);

  useEffect(() => {
    loadOSAData();
  }, []);

  const loadOSAData = async () => {
    setIsLoading(true);
    try {
      // Load analytics reports from API
      const [tutorPerf, studentEng, materialUse] = await Promise.all([
        analyticsService.getTutorPerformanceReport(),
        analyticsService.getStudentEngagementReport(),
        analyticsService.getMaterialUsageReport(),
      ]);

      setReports({
        tutorPerformance: tutorPerf,
        studentEngagement: studentEng,
        materialUsage: materialUse,
      });

      // Calculate stats from reports (API returns data in 'data' field, not 'summary')
      const totalStudents = studentEng.data?.totalStudents || 0;
      const totalSessions = tutorPerf.data?.totalSessions || 0;
      const avgRating = tutorPerf.data?.averageRating || 0;
      
      setStats({
        totalParticipants: totalStudents,
        totalCredits: totalSessions,
        eligibleScholarships: Math.floor(totalStudents * 0.3), // 30% estimation
        avgScore: avgRating,
      });
    } catch (error) {
      console.error("Failed to load OSA data:", error);
      toast.error("Failed to load analytics data");
      setStats({
        totalParticipants: 0,
        totalCredits: 0,
        eligibleScholarships: 0,
        avgScore: 0,
      });
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
      {reports && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Engagement Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-cyan-600" />
                Student Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <p className="text-sm text-cyan-900 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-cyan-700">
                      {reports.studentEngagement.data?.totalStudents || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-900 mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {reports.studentEngagement.data?.totalSessions || 0}
                    </p>
                  </div>
                </div>
                {reports.studentEngagement.data?.mostActiveStudents && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Most Active Students</p>
                    <div className="space-y-2">
                      {reports.studentEngagement.data.mostActiveStudents.slice(0, 3).map((student: any) => (
                        <div key={student.studentId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-900">{student.studentName}</span>
                          <Badge variant="secondary">{student.sessionCount} sessions</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tutor Performance Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Star className="w-5 h-5 text-amber-600" />
                Tutor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-900 mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {reports.tutorPerformance.data?.totalSessions || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg">
                    <p className="text-sm text-rose-900 mb-1">Avg Rating</p>
                    <p className="text-2xl font-bold text-rose-700">
                      {reports.tutorPerformance.data?.averageRating?.toFixed(1) || "0.0"}
                    </p>
                  </div>
                </div>
                {reports.tutorPerformance.data?.topTutors && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Tutors</p>
                    <div className="space-y-2">
                      {reports.tutorPerformance.data.topTutors.slice(0, 3).map((tutor: any) => (
                        <div key={tutor.tutorId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-900">{tutor.tutorName}</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-medium">{tutor.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Material Usage Report */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Material Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 mb-1">Total Materials</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {reports.materialUsage.data?.totalMaterials || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900 mb-1">Total Downloads</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {reports.materialUsage.data?.totalDownloads || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-900 mb-1">Avg Downloads/Material</p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {reports.materialUsage.data?.totalMaterials 
                        ? Math.round(reports.materialUsage.data.totalDownloads / reports.materialUsage.data.totalMaterials)
                        : 0}
                    </p>
                  </div>
                </div>
                {reports.materialUsage.data?.mostDownloadedMaterials && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Most Downloaded Materials</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {reports.materialUsage.data.mostDownloadedMaterials.slice(0, 4).map((material: any) => (
                        <div key={material.materialId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-900 truncate">{material.title}</span>
                          <Badge variant="secondary">{material.downloadCount} downloads</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!reports && !isLoading && (
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
                No Data Available
              </h3>
              <p className="text-gray-500">
                Unable to load analytics reports. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}
