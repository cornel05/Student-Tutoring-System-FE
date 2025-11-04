import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Download,
  Filter,
  Calendar,
  BarChart3,
} from "lucide-react";
import { mockAnalyticsData } from "../../data/mockData";
import { toast } from "sonner";

export function ADSDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  const analytics = mockAnalyticsData;

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
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Course</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Courses</option>
                {analytics.courses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Cohort</label>
              <select
                value={selectedCohort}
                onChange={e => setSelectedCohort(e.target.value)}
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
                onChange={e => setSelectedTerm(e.target.value)}
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
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Students</p>
                <p className="text-3xl">{analytics.kpis.totalStudents}</p>
                <p className="text-xs text-blue-100 mt-2">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last term
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
                <p className="text-3xl">{analytics.kpis.activeSessions}</p>
                <p className="text-xs text-green-100 mt-2">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% from last term
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
                <p className="text-purple-100 text-sm mb-1">
                  Avg Grade Improvement
                </p>
                <p className="text-3xl">
                  +{analytics.kpis.avgGradeImprovement}
                </p>
                <p className="text-xs text-purple-100 mt-2">
                  Students with tutoring
                </p>
              </div>
              <Award className="w-12 h-12 text-purple-200 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Success Rate</p>
                <p className="text-3xl">{analytics.kpis.successRate}%</p>
                <p className="text-xs text-orange-100 mt-2">Course pass rate</p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-200 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {analytics.courses.map(course => (
                  <tr key={course.code} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{course.code}</p>
                        <p className="text-xs text-gray-500">{course.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{course.enrolled}</td>
                    <td className="py-3 px-4 text-sm">
                      {course.withTutoring} (
                      {((course.withTutoring / course.enrolled) * 100).toFixed(
                        0
                      )}
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tutoring Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tutoring Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Students Seeking Help</p>
                  <p className="text-2xl text-gray-900">
                    {analytics.kpis.studentsSeekingHelp}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">45% of total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">
                    Improved After Tutoring
                  </p>
                  <p className="text-2xl text-gray-900">
                    {analytics.kpis.improvedAfterTutoring}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">
                    {(
                      (analytics.kpis.improvedAfterTutoring /
                        analytics.kpis.studentsSeekingHelp) *
                      100
                    ).toFixed(0)}
                    % success
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">
                    Average Sessions per Student
                  </p>
                  <p className="text-2xl text-gray-900">
                    {analytics.kpis.avgSessionsPerStudent}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Over semester</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-900">High Demand Subjects</p>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  MT2013, CO3021, CO3005 have highest tutoring requests
                </p>
                <p className="text-xs text-blue-600">
                  Consider increasing tutor allocation
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-900">Peak Tutoring Times</p>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Monday 14:00-16:00, Wednesday 14:00-16:00
                </p>
                <p className="text-xs text-blue-600">
                  Optimize scheduling around these slots
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-900">Student Satisfaction</p>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  4.6/5.0 average rating across all tutors
                </p>
                <p className="text-xs text-blue-600">
                  Excellent program effectiveness
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
