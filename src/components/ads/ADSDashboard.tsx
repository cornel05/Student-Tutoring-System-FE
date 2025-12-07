import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Download,
  Filter,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

// Kiểu dữ liệu enrollment trả về từ API
type Enrollment = {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  courseCode: string;
  semester: string;
  grade: number | null;
  enrollmentStatus: string;
  createdAt: string;
  updatedAt: string;
  credits: number | null;
};

// Kiểu thống kê theo course
type CourseStats = {
  courseCode: string;
  courseName: string;
  studentsEnrolled: number;
  withTutoring: number;
  passRate: number;
  avgScore: number;
};

// Kiểu dữ liệu report từ API generateStudentEngagementReport
type StudentEngagementReport = {
  reportType: string; // "STUDENT_ENGAGEMENT"
  generatedAt: string;
  generatedBy: string;
  summary: string;
  data: {
    totalStudents: number;
    totalSessions: number;
    totalFeedback: number;
    feedbackRate: number; // %
  };
};

export function ADSDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [engagementReport, setEngagementReport] =
    useState<StudentEngagementReport | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  // Gọi API student engagement report (lấy totalStudents, sessions,...)
  const fetchEngagementReport = async () => {
    try {
      setLoadingReport(true);
      const res = await fetch(`/api/analytics/reports/by-role/OAA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load report");
      }

      const data: StudentEngagementReport = await res.json();
      setEngagementReport(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load report");
    } finally {
      setLoadingReport(false);
    }
  };

  // Gọi API enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/enrollments?semester=252`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const data: Enrollment[] = await res.json();
      setEnrollments(data);

      // Từ enrollments -> gom theo course
      const statsMap = new Map<string, CourseStats>();

      data.forEach((e) => {
        const key = e.subjectCode; // hoặc e.courseCode tuỳ backend
        if (!statsMap.has(key)) {
          statsMap.set(key, {
            courseCode: e.subjectCode,
            courseName: e.subjectName,
            studentsEnrolled: 0,
            withTutoring: 0,
            passRate: 0,
            avgScore: 0,
          });
        }

        const cs = statsMap.get(key)!;
        cs.studentsEnrolled += 1;
      });

      const statsArray: CourseStats[] = Array.from(statsMap.values()).map(
        (c) => ({
          ...c,
          // Tạm mock passRate & avgScore, sau này tính từ grade
          passRate: 80,
          avgScore: 7.5,
        })
      );

      setCourseStats(statsArray);
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "Failed to load enrollments",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagementReport();
    fetchEnrollments();
  }, []);

  const handleExportCSV = () => {
    toast.success("CSV Export", {
      description: "Analytics report exported successfully",
    });
  };

  const handleExportPDF = () => {
    toast.success("PDF Export", {
      description: "Analytics report exported successfully",
    });
  };

  const filteredCourseStats =
    selectedCourse === "all"
      ? courseStats
      : courseStats.filter((c) => c.courseCode === selectedCourse);

  // Lấy KPI từ report, fallback 0 nếu chưa có
  const totalStudents = engagementReport?.data.totalStudents ?? 0;
  const totalSessions = engagementReport?.data.totalSessions ?? 0;
  const feedbackRate = engagementReport?.data.feedbackRate ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Academic Department Analytics</h1>
        <p className="text-gray-600">
          Monitor course performance, student engagement, and tutoring outcomes
        </p>
      </div>

      {/* Filters Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Courses</option>
                {courseStats.map((course) => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Cohort</label>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Cohorts</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Terms</option>
                <option value="fall-2023">Fall 2023</option>
                <option value="spring-2024">Spring 2024</option>
                <option value="fall-2024">Fall 2024</option>
                <option value="spring-2025">Spring 2025</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleExportCSV} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export as CSV
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Grid: dùng dữ liệu thật từ engagementReport */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Students</p>
                <p className="text-3xl">
                  {loadingReport ? "..." : totalStudents}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-200 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Active Sessions</p>
                <p className="text-3xl">
                  {loadingReport ? "..." : totalSessions}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-green-200 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Feedback Rate</p>
                <p className="text-3xl">
                  {loadingReport ? "..." : `${feedbackRate.toFixed(1)}%`}
                </p>
                <p className="text-xs text-purple-100 mt-2">
                  Percentage of sessions with feedback
                </p>
              </div>
              <Award className="w-12 h-12 text-purple-200 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table: dùng data từ enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Course Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading enrollments...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      Course
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      Students Enrolled
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      With Tutoring
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      Pass Rate
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      Avg Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourseStats.map((course) => (
                    <tr
                      key={course.courseCode}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {course.courseCode}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.courseName}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {course.studentsEnrolled}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {course.withTutoring} (
                        {course.studentsEnrolled > 0
                          ? (
                              (course.withTutoring / course.studentsEnrolled) *
                              100
                            ).toFixed(0)
                          : 0}
                        %)
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            course.passRate >= 80
                              ? "bg-green-100 text-green-700"
                              : course.passRate >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {course.passRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {course.avgScore.toFixed(1)}
                      </td>
                    </tr>
                  ))}

                  {filteredCourseStats.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 px-4 text-sm text-gray-500 text-center"
                      >
                        No course data from enrollments.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
