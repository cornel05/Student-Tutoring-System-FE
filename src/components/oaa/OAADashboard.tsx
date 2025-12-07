import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  Users,
  Calendar,
  Award,
  Download,
  PieChart,
  BarChart3,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface OAAReportResponse {
  reportType: string;
  generatedAt: string;
  generatedBy: string;
  data: {
    totalFeedback: number;
    totalSessions: number;
    feedbackRate: number;
    totalStudents: number;
  };
  summary: string;
}

export function OAADashboard() {
  const [report, setReport] = useState<OAAReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/analytics/reports/by-role/OAA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to load report");
      }
  
      const data = await res.json();
      setReport(data);
    } catch (error) {
      toast.error("Failed to load report");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownloadReport = () => {
    toast.success("Report Downloaded", {
      description: `OAA report has been downloaded successfully`,
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600">Loading OAA Dashboard…</div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 text-red-600">Failed to load OAA report.</div>
    );
  }

  // Fallback
  const {
    totalStudents = 0,
    totalSessions = 0,
    feedbackRate = 0,
    totalFeedback = 0,
  } = report.data || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Office of Academic Affairs
        </h1>
        <p className="text-gray-600">Overview reports for resource allocation and strategic planning</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Utilization (Tự chuyển từ dữ liệu API) */}
        <Card className="border-indigo-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm mb-1 font-medium">Program Utilization</p>
                <p className="text-4xl font-bold text-gray-900">{feedbackRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-2">Feedback rate</p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm mb-1 font-medium">Student Engagement</p>
                <p className="text-4xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-xs text-gray-600 mt-2">Total students</p>
              </div>
              <Award className="w-12 h-12 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm mb-1 font-medium">Sessions Conducted</p>
                <p className="text-4xl font-bold text-gray-900">{totalSessions}</p>
                <p className="text-xs text-gray-600 mt-2">Completed sessions</p>
              </div>
              <BarChart3 className="w-12 h-12 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-gray-700" />
            Student Engagement Report
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 text-gray-800 text-sm">
            <p><strong>Total Students:</strong> {totalStudents}</p>
            <p><strong>Total Sessions:</strong> {totalSessions}</p>
            <p><strong>Total Feedback:</strong> {totalFeedback}</p>
            <p><strong>Feedback Rate:</strong> {feedbackRate.toFixed(2)}%</p>

            <div className="p-4 bg-indigo-50 rounded-lg text-xs text-indigo-800">
              {report.summary}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget (Không có trong API nên tạm dùng placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <PieChart className="w-5 h-5 text-gray-700" /> Resource Allocation Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Budget data not provided by API. Add fields in backend if needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
