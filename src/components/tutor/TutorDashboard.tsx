import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  MessageSquare,
  Award,
  BookOpen
} from 'lucide-react';
import { mockTutoringSessions } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

interface TutorDashboardProps {
  onNavigate: (page: string) => void;
}

export function TutorDashboard({ onNavigate }: TutorDashboardProps) {
  const [isAcceptingStudents, setIsAcceptingStudents] = useState(true);
  const [maxStudents, setMaxStudents] = useState(5);

  const sessions = mockTutoringSessions;
  const activeStudents = sessions.filter(s => s.status === 'active').length;
  const totalMeetings = sessions.reduce((acc, s) => acc + s.meetings.length, 0);
  const attendanceRate = sessions.reduce((acc, s) => {
    const attended = s.meetings.filter(m => m.attended).length;
    return acc + (attended / s.meetings.length || 0);
  }, 0) / sessions.length * 100 || 0;

  const handleToggleAccepting = (checked: boolean) => {
    setIsAcceptingStudents(checked);
    toast.success(
      checked ? 'Now accepting new students' : 'No longer accepting new students'
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Tutor Dashboard</h1>
        <p className="text-gray-600">Manage your tutoring activities and students</p>
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
                  Toggle to {isAcceptingStudents ? 'stop' : 'start'} receiving new student requests this semester
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
                onChange={(e) => setMaxStudents(Number(e.target.value))}
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
                <p className="text-blue-100 text-xs mt-1">of {maxStudents} max</p>
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
                <p className="text-3xl">4.8</p>
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
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900">{session.studentName}</h4>
                    <p className="text-sm text-gray-600">{session.subjectName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {session.meetings.length} meetings
                    </p>
                    <p className="text-sm text-green-600">
                      {session.meetings.filter(m => m.attended).length} attended
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active tutoring sessions
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('schedule')}>
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">Manage Schedule</h3>
            <p className="text-sm text-gray-600">Set your available time slots</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('students')}>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">My Students</h3>
            <p className="text-sm text-gray-600">View and manage your students</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('messages')}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Chat with your students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
