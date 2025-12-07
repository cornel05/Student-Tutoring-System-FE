import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  MessageSquare,
  Award,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { sessionService, feedbackService, Session, FeedbackStats } from "../../services/api";

interface TutorDashboardProps {
  onNavigate: (page: string) => void;
}

export function TutorDashboard({ onNavigate }: TutorDashboardProps) {
  const [isAcceptingStudents, setIsAcceptingStudents] = useState(true);
  const [maxStudents, setMaxStudents] = useState(5);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get tutorId from localStorage or context (you'll need to store this on login)
  const tutorId = "tutor-1"; // TODO: Get from auth context

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [sessionsData, statsData] = await Promise.all([
        sessionService.getSessionsByTutor(tutorId),
        feedbackService.getTutorFeedbackStats(tutorId),
      ]);
      setSessions(sessionsData);
      setFeedbackStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const activeStudents = sessions.filter(s => s.status === "CONFIRMED" || s.status === "COMPLETED").length;
  const totalMeetings = sessions.length;
  const completedSessions = sessions.filter(s => s.status === "COMPLETED").length;
  const attendanceRate = totalMeetings > 0 ? (completedSessions / totalMeetings) * 100 : 0;

  const handleToggleAccepting = (checked: boolean) => {
    setIsAcceptingStudents(checked);
    toast.success(
      checked
        ? "Now accepting new students"
        : "No longer accepting new students"
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Tutor Dashboard</h1>
        <p className="text-gray-600">
          Manage your tutoring activities and students
        </p>
      </div>

      {/* Settings Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-gray-900 mb-4">Semester Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="accepting" className="text-base">
                  Accept Tutoring Requests
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Toggle to {isAcceptingStudents ? "stop" : "start"} receiving
                  new student requests this semester
                </p>
              </div>
              <Switch
                id="accepting"
                checked={isAcceptingStudents}
                onCheckedChange={handleToggleAccepting}
              />
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <Label htmlFor="maxStudents" className="text-base mb-3 block">
                Maximum Students: {maxStudents}
              </Label>
              <input
                id="maxStudents"
                type="range"
                min="1"
                max="10"
                value={maxStudents}
                onChange={e => setMaxStudents(Number(e.target.value))}
                className="w-full"
                disabled={!isAcceptingStudents}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 student</span>
                <span>10 students</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Active Students</p>
                <p className="text-3xl">{activeStudents}</p>
                <p className="text-blue-100 text-xs mt-1">
                  of {maxStudents} max
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Meetings</p>
                <p className="text-3xl">{totalMeetings}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Attendance Rate</p>
                <p className="text-3xl">{attendanceRate.toFixed(0)}%</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Avg. Rating</p>
                <p className="text-3xl">
                  {isLoading ? "..." : feedbackStats?.averageRating.toFixed(1) || "N/A"}
                </p>
                {feedbackStats && feedbackStats.totalFeedback > 0 && (
                  <p className="text-orange-100 text-xs mt-1">
                    {feedbackStats.totalFeedback} reviews
                  </p>
                )}
              </div>
              <Award className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading sessions...</div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map(session => (
                <div key={session.sessionId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900">Student: {session.studentId}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(session.startTime).toLocaleDateString()} at{" "}
                        {new Date(session.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mode: {session.mode}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        session.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                        session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No sessions found. Start accepting students!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onNavigate("schedule")}
        >
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">Manage Schedule</h3>
            <p className="text-sm text-gray-600">
              Set your available time slots
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onNavigate("students")}
        >
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">My Students</h3>
            <p className="text-sm text-gray-600">
              View and manage your students
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
