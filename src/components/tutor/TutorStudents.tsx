import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  TrendingUp,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  Award,
  IdCard
} from 'lucide-react';
import { mockTutoringSessions, mockSubjects } from '../../data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function TutorStudents() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const sessions = mockTutoringSessions;

  const selectedSession = sessions.find(s => s.id === selectedStudent);

  // Mock student detailed data
  const studentDetails = {
    studentId: '2021001',
    major: 'Computer Science',
    year: 3,
    phone: '+84 901 234 567',
    email: 'an.nguyen@hcmut.edu.vn',
    gpa: 7.2,
    subjects: mockSubjects,
    attendance: 85,
    performance: 'improving'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-600">View and manage students you're tutoring</p>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map((session) => {
          const attendedMeetings = session.meetings.filter(m => m.attended).length;
          const attendanceRate = (attendedMeetings / session.meetings.length) * 100 || 0;

          return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`} />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{session.studentName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{session.subjectName}</p>
                    <Badge className={
                      session.status === 'active' 
                        ? 'bg-green-500' 
                        : 'bg-gray-500'
                    }>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl text-blue-600">{session.meetings.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Meetings</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl text-green-600">{attendanceRate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-600 mt-1">Attendance</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl text-purple-600">
                      {Math.floor((Date.now() - new Date(session.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))}w
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Duration</p>
                  </div>
                </div>

                {/* Recent Meeting */}
                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Latest Meeting</h4>
                  {session.meetings.length > 0 ? (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-900">
                          {new Date(session.meetings[session.meetings.length - 1].date).toLocaleDateString()}
                        </span>
                        {session.meetings[session.meetings.length - 1].attended ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      {session.meetings[session.meetings.length - 1].notes && (
                        <p className="text-xs text-gray-600">
                          {session.meetings[session.meetings.length - 1].notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No meetings yet</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedStudent(session.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No students yet</h3>
            <p className="text-gray-500">You don't have any students assigned to you</p>
          </CardContent>
        </Card>
      )}

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSession?.studentId}`} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-gray-900">{selectedSession?.studentName}</h3>
                <p className="text-sm text-gray-600">Full Student Profile</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="personal" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <IdCard className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Student ID</p>
                        <p className="text-gray-900">{studentDetails.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{studentDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">{studentDetails.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Major</p>
                        <p className="text-gray-900">{studentDetails.major}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Overall GPA</p>
                        <p className="text-3xl text-blue-900">{studentDetails.gpa}</p>
                      </div>
                      <Award className="w-12 h-12 text-blue-300" />
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-600 mb-3">All Subjects</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {studentDetails.subjects.map((subject) => (
                      <div key={subject.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="text-sm text-gray-900">{subject.name}</h5>
                            <p className="text-xs text-gray-600">{subject.code}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg ${
                              subject.score && subject.score < 7.0 
                                ? 'text-orange-600' 
                                : 'text-green-600'
                            }`}>
                              {subject.score?.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <Progress 
                          value={(subject.score || 0) * 10} 
                          className={
                            subject.score && subject.score < 7.0
                              ? '[&>div]:bg-orange-500'
                              : '[&>div]:bg-green-500'
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tutoring Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="text-green-900">Performance Trend</h4>
                      </div>
                      <p className="text-green-800">Student is showing improvement in {selectedSession?.subjectName}</p>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-600 mb-3">Comments & Notes</h4>
                      <div className="space-y-2">
                        {selectedSession?.meetings.filter(m => m.notes).map((meeting) => (
                          <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                              {new Date(meeting.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-900">{meeting.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Attendance Rate</p>
                    <p className="text-3xl text-purple-900">{studentDetails.attendance}%</p>
                  </div>

                  <div className="space-y-2">
                    {selectedSession?.meetings.map((meeting) => (
                      <div 
                        key={meeting.id}
                        className={`p-4 rounded-lg border-2 ${
                          meeting.attended
                            ? 'border-green-200 bg-green-50'
                            : 'border-orange-200 bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm text-gray-900">
                                {new Date(meeting.date).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {meeting.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {meeting.time} • {meeting.duration} minutes
                            </p>
                          </div>
                          {meeting.attended ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm">Attended</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-orange-600">
                              <XCircle className="w-5 h-5" />
                              <span className="text-sm">Absent</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
