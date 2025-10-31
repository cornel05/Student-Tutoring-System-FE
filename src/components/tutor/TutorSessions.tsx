import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  Calendar, 
  Video, 
  CheckCircle2, 
  XCircle,
  User,
  BookOpen,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Award,
  FileText,
  MessageSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { mockTutoringSessions, mockSubjects } from '../../data/mockData';
import { TutoringSession } from '../../types';
import { toast } from 'sonner';

// Mock student feedback data
const mockStudentFeedback: Record<string, {
  rating: number;
  comment: string;
  recommended: boolean;
  timestamp: string;
}> = {
  'ts2': {
    rating: 5,
    comment: 'Excellent tutor! Very patient and explains concepts clearly. The teaching materials were well-prepared and the sessions were always productive.',
    recommended: true,
    timestamp: '2024-08-15'
  },
  'ts3': {
    rating: 4,
    comment: 'Good teaching style and helpful explanations. Would have appreciated more practice problems.',
    recommended: true,
    timestamp: '2024-04-10'
  },
  'ts4': {
    rating: 5,
    comment: 'Outstanding tutor! Really helped me understand complex networking concepts. Highly recommend!',
    recommended: true,
    timestamp: '2024-05-20'
  }
};

export function TutorSessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>(mockTutoringSessions);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('progress');
  const [progressNotes, setProgressNotes] = useState<Record<string, string>>({});
  const [savingProgress, setSavingProgress] = useState(false);

  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  const session = sessions.find(s => s.id === selectedSession);
  const studentFeedback = session ? mockStudentFeedback[session.id] : null;

  // Calculate session statistics
  const getSessionStats = (session: TutoringSession) => {
    const totalMeetings = session.meetings.length;
    const attendedMeetings = session.meetings.filter(m => m.attended).length;
    const attendanceRate = totalMeetings > 0 ? (attendedMeetings / totalMeetings) * 100 : 0;
    
    return {
      totalMeetings,
      attendedMeetings,
      attendanceRate
    };
  };

  // Get subject details
  const getSubjectDetails = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId);
  };

  const handleSaveProgress = () => {
    if (!selectedSession) return;

    setSavingProgress(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Progress notes saved successfully', {
        description: 'Student progress log has been updated'
      });
      setSavingProgress(false);
    }, 1000);
  };

  // Calculate aggregate feedback statistics
  const getFeedbackStats = () => {
    const feedbacks = Object.values(mockStudentFeedback);
    if (feedbacks.length === 0) return null;

    const avgRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;
    const recommendCount = feedbacks.filter(f => f.recommended).length;
    const recommendRate = (recommendCount / feedbacks.length) * 100;

    return {
      totalFeedbacks: feedbacks.length,
      avgRating,
      recommendRate
    };
  };

  const feedbackStats = getFeedbackStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tutoring Sessions</h1>
          <p className="text-gray-600">View and manage your tutoring sessions with students</p>
        </div>

        {/* Feedback Stats Card */}
        {feedbackStats && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{feedbackStats.avgRating.toFixed(1)}</p>
                    <p className="text-xs text-yellow-700">Avg Rating</p>
                  </div>
                </div>
                <div className="border-l border-yellow-300 pl-4">
                  <p className="text-2xl font-bold text-orange-900">{feedbackStats.recommendRate.toFixed(0)}%</p>
                  <p className="text-xs text-orange-700">Recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Sessions ({activeSessions.length})</h2>
        {activeSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No active sessions</h3>
              <p className="text-gray-500">You don't have any active tutoring sessions at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map((session) => {
              const stats = getSessionStats(session);
              const subject = getSubjectDetails(session.subjectId);
              
              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base mb-1">{session.studentName}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{session.subjectName}</p>
                          <Badge variant="outline" className="text-xs">
                            {subject?.code}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Session Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-xl font-semibold text-blue-600">{stats.totalMeetings}</p>
                        <p className="text-xs text-gray-600">Meetings</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-xl font-semibold text-green-600">{stats.attendanceRate.toFixed(0)}%</p>
                        <p className="text-xs text-gray-600">Attendance</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <p className="text-xl font-semibold text-purple-600">
                          {Math.floor((Date.now() - new Date(session.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))}w
                        </p>
                        <p className="text-xs text-gray-600">Duration</p>
                      </div>
                    </div>

                    {/* Latest Meeting */}
                    {session.meetings.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-medium text-gray-600 mb-2">Latest Meeting</h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">
                            {new Date(session.meetings[session.meetings.length - 1].date).toLocaleDateString()}
                          </span>
                          {session.meetings[session.meetings.length - 1].attended ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedSession(session.id);
                          setSelectedTab('progress');
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="mr-2 h-4 w-4" />
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
        )}
      </div>

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Completed Sessions ({completedSessions.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.map((session) => {
              const stats = getSessionStats(session);
              const subject = getSubjectDetails(session.subjectId);
              const feedback = mockStudentFeedback[session.id];
              
              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base mb-1">{session.studentName}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{session.subjectName}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {subject?.code}
                            </Badge>
                            {feedback && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">{feedback.rating}.0</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-500 text-white">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Session Summary */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <span className="text-gray-600">Meetings:</span>
                          <span className="ml-1 font-semibold text-gray-900">{stats.totalMeetings}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attended:</span>
                          <span className="ml-1 font-semibold text-gray-900">{stats.attendedMeetings}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rate:</span>
                          <span className="ml-1 font-semibold text-gray-900">{stats.attendanceRate.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Student Feedback Preview */}
                    {feedback && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <ThumbsUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-green-900 text-sm font-medium">Student Feedback</h4>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= feedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-green-800 text-xs line-clamp-2">{feedback.comment}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedSession(session.id);
                        setSelectedTab('feedback');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Details & Feedback
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.studentId}`} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{session?.studentName}</h3>
                <p className="text-sm text-gray-600">{session?.subjectName}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress & Attendance</TabsTrigger>
              <TabsTrigger value="notes">Meeting Notes</TabsTrigger>
              <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
            </TabsList>

            {/* Progress & Attendance Tab */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {session && (
                    <>
                      {/* Stats Summary */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-blue-600">{getSessionStats(session).totalMeetings}</p>
                          <p className="text-sm text-gray-600 mt-1">Total Meetings</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-green-600">{getSessionStats(session).attendedMeetings}</p>
                          <p className="text-sm text-gray-600 mt-1">Attended</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-purple-600">{getSessionStats(session).attendanceRate.toFixed(0)}%</p>
                          <p className="text-sm text-gray-600 mt-1">Attendance Rate</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-orange-600">
                            {Math.floor((Date.now() - new Date(session.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Weeks Active</p>
                        </div>
                      </div>

                      {/* Meeting History */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-3">Meeting History</h4>
                        <div className="space-y-2">
                          {session.meetings.map((meeting) => (
                            <div 
                              key={meeting.id}
                              className={`p-4 rounded-lg border-2 ${
                                meeting.attended
                                  ? 'border-green-200 bg-green-50'
                                  : 'border-orange-200 bg-orange-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {new Date(meeting.date).toLocaleDateString()}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {meeting.type}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 ml-7">
                                    {meeting.time} • {meeting.duration} minutes
                                  </p>
                                </div>
                                {meeting.attended ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">Attended</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-orange-600">
                                    <XCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">Absent</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Notes */}
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">Student Progress Assessment</h4>
                        <div className="space-y-4">
                          <div>
                            <Label>Progress Notes</Label>
                            <Textarea
                              value={progressNotes[session.id] || ''}
                              onChange={(e) => setProgressNotes({
                                ...progressNotes,
                                [session.id]: e.target.value
                              })}
                              placeholder="Document student progress, strengths, areas for improvement, and learning outcomes..."
                              className="mt-2 min-h-[120px]"
                            />
                          </div>
                          <Button 
                            onClick={handleSaveProgress}
                            disabled={savingProgress}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {savingProgress ? 'Saving...' : 'Save Progress Notes'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meeting Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Notes & Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {session?.meetings.filter(m => m.notes).map((meeting) => (
                      <div key={meeting.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(meeting.date).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {meeting.type}
                          </Badge>
                          {meeting.attended && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{meeting.notes}</p>
                      </div>
                    ))}
                    {session?.meetings.filter(m => m.notes).length === 0 && (
                      <p className="text-center text-gray-500 py-8">No meeting notes available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Student Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              {studentFeedback ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Student Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating Display */}
                    <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="text-center mb-4">
                        <p className="text-5xl font-bold text-yellow-900 mb-2">{studentFeedback.rating}.0</p>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= studentFeedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Rating: {studentFeedback.rating === 5 ? 'Excellent' : 
                                   studentFeedback.rating === 4 ? 'Very Good' : 
                                   studentFeedback.rating === 3 ? 'Good' : 
                                   studentFeedback.rating === 2 ? 'Fair' : 'Poor'}
                        </p>
                      </div>
                    </div>

                    {/* Feedback Comment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Student Comments</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-gray-900 leading-relaxed">{studentFeedback.comment}</p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Recommendation Status</h4>
                      <div className={`p-4 rounded-lg border-2 ${
                        studentFeedback.recommended
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {studentFeedback.recommended ? (
                            <>
                              <ThumbsUp className="w-6 h-6 text-green-600" />
                              <div>
                                <p className="text-green-900 font-medium">Recommended to Other Students</p>
                                <p className="text-sm text-green-700">Student would recommend your tutoring services</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-6 h-6 text-red-600" />
                              <div>
                                <p className="text-red-900 font-medium">Not Recommended</p>
                                <p className="text-sm text-red-700">Student would not recommend your tutoring services</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feedback Date */}
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Feedback submitted on {new Date(studentFeedback.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Respond to Student
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Feedback Yet</h3>
                    <p className="text-gray-500">
                      {session?.status === 'active' 
                        ? 'Student will be able to provide feedback after the session is completed'
                        : 'Student has not provided feedback for this session'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Aggregate Feedback Stats */}
              {feedbackStats && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Your Overall Feedback Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          <p className="text-3xl font-bold text-blue-900">{feedbackStats.avgRating.toFixed(1)}</p>
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-xs text-gray-500 mt-1">From {feedbackStats.totalFeedbacks} students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <ThumbsUp className="w-6 h-6 text-green-600" />
                          <p className="text-3xl font-bold text-green-900">{feedbackStats.recommendRate.toFixed(0)}%</p>
                        </div>
                        <p className="text-sm text-gray-600">Recommendation Rate</p>
                        <p className="text-xs text-gray-500 mt-1">Students who recommend you</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                          <p className="text-3xl font-bold text-purple-900">{feedbackStats.totalFeedbacks}</p>
                        </div>
                        <p className="text-sm text-gray-600">Total Feedback</p>
                        <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
