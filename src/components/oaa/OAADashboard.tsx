import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  Download,
  PieChart,
  BarChart3,
  Target
} from 'lucide-react';
import { mockOAAReports } from '../../data/mockData';
import { toast } from 'sonner';

export function OAADashboard() {
  const reports = mockOAAReports;

  const handleDownloadReport = (reportType: string) => {
    toast.success('Report Downloaded', {
      description: `${reportType} report has been downloaded successfully`
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Office of Academic Affairs</h1>
        <p className="text-gray-600">Overview reports for resource allocation and strategic planning</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-indigo-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm mb-1 font-medium">Program Utilization</p>
                <p className="text-4xl font-bold text-gray-900">{reports.utilization.rate}%</p>
                <p className="text-xs text-gray-600 mt-2">
                  {reports.utilization.trend} from last semester
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm mb-1 font-medium">Student Satisfaction</p>
                <p className="text-4xl font-bold text-gray-900">{reports.satisfaction.score}/5.0</p>
                <p className="text-xs text-gray-600 mt-2">
                  Based on {reports.satisfaction.responses} responses
                </p>
              </div>
              <Award className="w-12 h-12 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm mb-1 font-medium">Academic Outcomes</p>
                <p className="text-4xl font-bold text-gray-900">+{reports.outcomes.improvement}%</p>
                <p className="text-xs text-gray-600 mt-2">
                  Average grade improvement
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-gray-700" />
            Program Utilization Analysis
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadReport('Utilization')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Participants</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.utilization.totalParticipants}</p>
                <p className="text-xs text-gray-500">
                  {reports.utilization.studentPercentage}% of student body
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Active Tutors</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.utilization.activeTutors}</p>
                <p className="text-xs text-gray-500">
                  Across {reports.utilization.departments} departments
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Sessions Conducted</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.utilization.sessionsCompleted}</p>
                <p className="text-xs text-gray-500">
                  This semester
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Avg Hours per Student</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.utilization.avgHoursPerStudent}</p>
                <p className="text-xs text-gray-500">
                  Per semester
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-900 mb-2">Recommendation</p>
              <p className="text-xs text-indigo-700">
                Current utilization rate of {reports.utilization.rate}% indicates healthy program adoption. 
                Consider expanding tutor capacity by 15% to meet growing demand in Computer Science and Mathematics departments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Satisfaction Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Award className="w-5 h-5 text-gray-700" />
            Student Satisfaction Report
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadReport('Satisfaction')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reports.satisfaction.breakdown.map((item) => (
                <div key={item.category} className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl text-gray-900">{item.score}</p>
                    <p className="text-sm text-gray-500 mb-1">/5.0</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-pink-900 mb-2">Key Insights</p>
              <ul className="space-y-1 text-xs text-pink-700">
                <li>• 92% of students report improved understanding of course material</li>
                <li>• 88% would recommend the tutoring program to peers</li>
                <li>• Most valued aspects: Flexible scheduling (87%), Peer learning approach (85%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outcomes Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5 text-gray-700" />
            Academic Outcomes Report
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadReport('Outcomes')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Pass Rate Improvement</p>
                <p className="text-2xl text-gray-900 mb-1">+{reports.outcomes.passRateIncrease}%</p>
                <p className="text-xs text-gray-500">
                  Students with tutoring vs without
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Grade Point Increase</p>
                <p className="text-2xl text-gray-900 mb-1">+{reports.outcomes.gradePointIncrease}</p>
                <p className="text-xs text-gray-500">
                  Average improvement
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Retention Rate</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.outcomes.retentionRate}%</p>
                <p className="text-xs text-gray-500">
                  Students continuing in program
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Success Stories</p>
                <p className="text-2xl text-gray-900 mb-1">{reports.outcomes.successStories}</p>
                <p className="text-xs text-gray-500">
                  Grade F to C+ or better
                </p>
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-900 mb-2">Strategic Recommendations</p>
              <ul className="space-y-1 text-xs text-teal-700">
                <li>• Allocate additional budget: Estimated ROI of 3.2x based on retention improvements</li>
                <li>• Expand program to include group tutoring sessions (pilot showed +15% engagement)</li>
                <li>• Integrate with early warning systems to proactively identify at-risk students</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <PieChart className="w-5 h-5 text-gray-700" />
            Resource Allocation Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <p className="text-sm text-blue-900 mb-2">Current Semester</p>
              <p className="text-2xl text-blue-700 mb-1">{reports.budget.current}</p>
              <p className="text-xs text-blue-600">
                Allocated budget
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <p className="text-sm text-green-900 mb-2">Recommended Allocation</p>
              <p className="text-2xl text-green-700 mb-1">{reports.budget.recommended}</p>
              <p className="text-xs text-green-600">
                For next semester
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-purple-50">
              <p className="text-sm text-purple-900 mb-2">Expected Impact</p>
              <p className="text-2xl text-purple-700 mb-1">+{reports.budget.expectedGrowth}%</p>
              <p className="text-xs text-purple-600">
                Program capacity increase
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
