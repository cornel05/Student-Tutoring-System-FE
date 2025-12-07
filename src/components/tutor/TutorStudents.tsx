import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  IdCard,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { sessionService, userService, profileService, Session } from "../../services/api";
import { toast } from "sonner";

interface StudentSession extends Session {
  id?: string;
  studentName?: string;
  studentEmail?: string;
  subjectName?: string;
  meetings?: any[];
  startDate?: string;
}

export function TutorStudents() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any>(null);
  const [tutorId, setTutorId] = useState<string>("");

  // Get current tutor from localStorage
  const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  };
  
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || "";

  useEffect(() => {
    loadTutorProfile();
  }, []);

  const loadTutorProfile = async () => {
    try {
      // Fetch tutor profile to get tutorId
      const profile: any = await profileService.getUserProfile(userId);
      console.log("Tutor profile:", profile);
      
      // Extract tutorId from profile (it's stored in the tutorId field)
      if (profile.tutorId) {
        setTutorId(profile.tutorId);
        await loadStudents(profile.tutorId);
      } else {
        toast.error("Tutor ID not found in profile");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to load tutor profile:", error);
      toast.error("Failed to load tutor profile");
      setIsLoading(false);
    }
  };

  const loadStudents = async (tutorIdParam: string) => {
    setIsLoading(true);
    try {
      console.log("Loading sessions for tutorId:", tutorIdParam);
      // Fetch sessions for this tutor - API already returns student names
      const sessionsData: any[] = await sessionService.getSessionsByTutor(tutorIdParam);
      
      console.log("Sessions data:", sessionsData);
      
      // Get unique student IDs
      const studentIds = [...new Set(sessionsData.map((s: any) => s.studentId))];
      
      // Group sessions by student
      const enhancedSessions: StudentSession[] = studentIds.map((studentId: string) => {
        const studentSessions = sessionsData.filter((s: any) => s.studentId === studentId);
        
        // Use the first session as the main session object
        const mainSession = studentSessions[0];
        
        return {
          sessionId: mainSession.sessionId,
          tutorId: mainSession.tutorId,
          studentId: mainSession.studentId,
          startTime: mainSession.startTime,
          endTime: mainSession.endTime,
          mode: mainSession.mode,
          status: mainSession.status,
          locationOrLink: mainSession.locationOrLink,
          id: mainSession.studentUuid || studentId, // Use studentUuid as the unique identifier
          studentName: mainSession.studentName || "Unknown Student",
          studentEmail: mainSession.studentEmail || "",
          subjectName: "General Tutoring",
          meetings: studentSessions.map((s: any) => ({
            date: s.startTime,
            attended: s.status === 'COMPLETED',
            notes: s.status,
          })),
          startDate: mainSession.startTime,
        };
      });
      
      console.log("Enhanced sessions:", enhancedSessions);
      setSessions(enhancedSessions);
      toast.success(`Loaded ${enhancedSessions.length} student(s)`);
    } catch (error) {
      console.error("Failed to load students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentDetails = async (studentUuid: string) => {
    try {
      console.log("Loading profile for student UUID:", studentUuid);
      const profile = await profileService.getUserProfile(studentUuid);
      console.log("Student profile loaded:", profile);
      setSelectedStudentProfile(profile);
    } catch (error) {
      console.error("Failed to load student profile:", error);
      toast.error("Failed to load student details");
      setSelectedStudentProfile(null);
    }
  };

  const handleViewDetails = (sessionId: string) => {
    setSelectedStudent(sessionId);
    loadStudentDetails(sessionId);
  };

  const selectedSession = sessions.find(s => s.id === selectedStudent);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-600">
          View and manage students you're tutoring
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading students...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Students List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map(session => {
              const attendedMeetings = session.meetings?.filter(
                (m: any) => m.attended
              ).length || 0;
              const totalMeetings = session.meetings?.length || 1;
              const attendanceRate =
                (attendedMeetings / totalMeetings) * 100 || 0;

              return (
                <Card
                  key={session.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`}
                        />
                        <AvatarFallback>
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">
                          {session.studentName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {session.subjectName}
                        </p>
                        <Badge
                          className={
                            session.status === "CONFIRMED" || session.status === "COMPLETED"
                              ? "bg-green-500"
                              : session.status === "PENDING" || session.status === "PENDING_TUTOR_APPROVAL"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl text-blue-600">
                          {totalMeetings}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Meetings</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl text-green-600">
                      {attendanceRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Attendance</p>
                  </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl text-purple-600">
                          {session.startDate ? Math.floor(
                            (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) /
                              (1000 * 60)
                          ) : 0}
                          m
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Duration</p>
                      </div>
                    </div>

                    {/* Recent Meeting */}
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Latest Meeting</h4>
                      {session.meetings && session.meetings.length > 0 ? (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-900">
                              {new Date(
                                session.meetings[session.meetings.length - 1].date
                              ).toLocaleDateString()}
                            </span>
                            {session.meetings[session.meetings.length - 1]
                              .attended ? (
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
                        onClick={() => session.id && handleViewDetails(session.id)}
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
                <p className="text-gray-500">
                  You don't have any students assigned to you
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Student Details Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSession?.studentId}`}
                />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-gray-900">
                  {selectedSession?.studentName}
                </h3>
                <p className="text-sm text-gray-600">Full Student Profile</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="personal" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedStudentProfile ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Student ID</p>
                          <p className="text-gray-900">
                            {selectedStudentProfile.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-900">{selectedStudentProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-900">{selectedStudentProfile.phoneNumber || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Major</p>
                          <p className="text-gray-900">{selectedStudentProfile.major || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Campus</p>
                          <p className="text-gray-900">{selectedStudentProfile.campus || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="text-gray-900">{selectedStudentProfile.gender || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-600">Loading student details...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSession?.meetings && selectedSession.meetings.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSession.meetings.map((meeting: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(meeting.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{meeting.notes}</p>
                          </div>
                          {meeting.attended ? (
                            <Badge className="bg-green-500">Completed</Badge>
                          ) : (
                            <Badge className="bg-yellow-500">Pending</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No session history available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
