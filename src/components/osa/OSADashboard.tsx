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
import { mockOSAReports } from "../../data/mockData";
import { toast } from "sonner";

export function OSADashboard() {
  const reports = mockOSAReports;

  const handleDownloadReport = (reportType: string) => {
    toast.success("Report Downloaded", {
      description: `${reportType} report has been downloaded successfully`,
    });
  };

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
                  {reports.participation.total}
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
                  {reports.credits.awarded}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  To {reports.credits.recipients} students
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
                  {reports.scholarships.eligible}
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
                  {reports.evaluation.avgScore}
                </p>
                <p className="text-xs text-gray-600 mt-2">Out of 5.0</p>
              </div>
              <Star className="w-12 h-12 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participation Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-gray-700" />
            Student Participation Analysis
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport("Participation")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Participation by Role */}
            <div>
              <h4 className="text-sm text-gray-700 mb-3">
                Participation by Role
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Students as Tutees</p>
                    <Badge variant="outline">
                      {reports.participation.asTutees} students
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{
                        width: `${(reports.participation.asTutees / reports.participation.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Students as Tutors</p>
                    <Badge variant="outline">
                      {reports.participation.asTutors} students
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(reports.participation.asTutors / reports.participation.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Participation by Year */}
            <div>
              <h4 className="text-sm text-gray-700 mb-3">
                Participation by Academic Year
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {reports.participation.byYear.map(year => (
                  <div
                    key={year.year}
                    className="p-3 border rounded-lg text-center"
                  >
                    <p className="text-xs text-gray-600 mb-1">
                      Year {year.year}
                    </p>
                    <p className="text-xl text-gray-900">{year.count}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {year.percentage}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg">
              <p className="text-sm text-cyan-900 mb-2">
                Participation Insights
              </p>
              <ul className="space-y-1 text-xs text-cyan-700">
                <li>
                  • Year 2 and Year 3 students show highest engagement (62%
                  combined)
                </li>
                <li>
                  • Peer tutoring appeals to mid-program students who can both
                  teach and learn
                </li>
                <li>
                  • Consider targeted outreach to Year 1 students (only 15%
                  participation)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Credits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Award className="w-5 h-5 text-gray-700" />
            Training Credits Report
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport("Training Credits")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Credits Awarded</p>
                <p className="text-2xl text-gray-900 mb-1">
                  {reports.credits.awarded}
                </p>
                <p className="text-xs text-gray-500">
                  Total credits this semester
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Average Credits per Student
                </p>
                <p className="text-2xl text-gray-900 mb-1">
                  {reports.credits.avgPerStudent}
                </p>
                <p className="text-xs text-gray-500">Based on participation</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Credit-Earning Students
                </p>
                <p className="text-2xl text-gray-900 mb-1">
                  {reports.credits.recipients}
                </p>
                <p className="text-xs text-gray-500">
                  {(
                    (reports.credits.recipients / reports.participation.total) *
                    100
                  ).toFixed(0)}
                  % of participants
                </p>
              </div>
            </div>

            {/* Credit Tiers */}
            <div>
              <h4 className="text-sm text-gray-700 mb-3">
                Credit Distribution by Tier
              </h4>
              <div className="space-y-2">
                {reports.credits.tiers.map(tier => (
                  <div key={tier.name} className="flex items-center gap-3">
                    <div className="w-32">
                      <p className="text-xs text-gray-600">{tier.name}</p>
                      <p className="text-xs text-gray-500">
                        ({tier.credits} credits)
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${tier.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 w-20 text-right">
                          {tier.students} students ({tier.percentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-900 mb-2">
                Credit System Performance
              </p>
              <p className="text-xs text-amber-700">
                {reports.credits.recipients} students earned training credits
                this semester. Most students (42%) achieved Bronze tier (2-3
                credits). Consider promoting Gold/Platinum achievements for next
                semester to incentivize sustained participation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholarship Eligibility */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-gray-700" />
            Scholarship Eligibility Report
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport("Scholarships")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-emerald-50">
                <p className="text-sm text-emerald-900 mb-2">
                  Eligible Students
                </p>
                <p className="text-3xl text-emerald-700 mb-1">
                  {reports.scholarships.eligible}
                </p>
                <p className="text-xs text-emerald-600">
                  Met minimum criteria (4+ credits, 4.0+ rating)
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-blue-900 mb-2">
                  Recommended for Award
                </p>
                <p className="text-3xl text-blue-700 mb-1">
                  {reports.scholarships.recommended}
                </p>
                <p className="text-xs text-blue-600">
                  Outstanding performance (5+ credits, 4.5+ rating)
                </p>
              </div>
            </div>

            {/* Top Performers */}
            <div>
              <h4 className="text-sm text-gray-700 mb-3">
                Top Performing Students (Scholarship Recommended)
              </h4>
              <div className="space-y-2">
                {reports.scholarships.topPerformers.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {student.studentId} - Year {student.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Credits</p>
                        <p className="text-sm text-gray-900">
                          {student.credits}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Rating</p>
                        <p className="text-sm text-gray-900">
                          {student.rating}/5.0
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Sessions</p>
                        <p className="text-sm text-gray-900">
                          {student.sessions}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Eligible
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-900 mb-2">
                Scholarship Recommendations
              </p>
              <ul className="space-y-1 text-xs text-emerald-700">
                <li>
                  • {reports.scholarships.recommended} students recommended for
                  peer tutoring excellence scholarship
                </li>
                <li>
                  • Criteria: Minimum 5 training credits, 4.5+ average rating,
                  consistent participation
                </li>
                <li>
                  • Suggested award amounts: Tier 1 (7+ credits): 5,000,000 VND,
                  Tier 2 (5-6 credits): 3,000,000 VND
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Outcomes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Star className="w-5 h-5 text-gray-700" />
            Student Evaluation Outcomes
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport("Evaluations")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reports.evaluation.categories.map(category => (
                <div key={category.name} className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{category.name}</p>
                  <div className="flex items-end gap-2 mb-2">
                    <p className="text-2xl text-gray-900">{category.score}</p>
                    <p className="text-sm text-gray-500 mb-1">/5.0</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-500 h-2 rounded-full"
                      style={{ width: `${(category.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-900 mb-2">Evaluation Summary</p>
              <p className="text-xs text-rose-700 mb-2">
                Overall satisfaction: {reports.evaluation.avgScore}/5.0 based on{" "}
                {reports.evaluation.responseCount} student evaluations.
              </p>
              <ul className="space-y-1 text-xs text-rose-700">
                <li>
                  • Highest rated: Teaching Quality (4.7/5.0) - Students
                  appreciate tutor expertise
                </li>
                <li>
                  • Improvement area: Scheduling Flexibility (4.3/5.0) -
                  Consider expanding available time slots
                </li>
                <li>
                  • Strong program impact: 89% report improved academic
                  confidence
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
