import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Calendar as CalendarIcon,
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
  MessageSquare,
  Upload,
  Link as LinkIcon,
  Paperclip,
  Eye,
  EyeOff,
  Save,
  Send,
  X,
  Plus,
  File,
  Download,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TutoringSession, SessionMaterial } from "../../types";
import { toast } from "sonner";
import { sessionService, profileService, feedbackService } from "../../services/api";
import { getCurrentUser } from "../../utils/auth";

export function TutorSessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tutorId, setTutorId] = useState("");
  const [feedbackStats, setFeedbackStats] = useState<{averageRating: number; totalFeedback: number} | null>(null);
  
  const currentUser = getCurrentUser();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("progress");
  const [progressNotes, setProgressNotes] = useState<Record<string, string>>(
    {}
  );
  const [savingProgress, setSavingProgress] = useState(false);
  
  useEffect(() => {
    loadTutorData();
  }, []);
  
  const loadTutorData = async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    try {
      // Get tutor profile to get tutorId
      const profile: any = await profileService.getUserProfile(currentUser.id);
      console.log("Tutor profile:", profile);
      
      if (profile.tutorId) {
        setTutorId(profile.tutorId);
        await loadSessions(profile.tutorId);
        await loadFeedbackStats(profile.tutorId);
      } else {
        toast.error("Tutor ID not found");
      }
    } catch (error) {
      console.error("Failed to load tutor data:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSessions = async (tutorIdParam: string) => {
    try {
      const apiSessions = await sessionService.getSessionsByTutor(tutorIdParam);
      console.log("API Sessions:", apiSessions);
      
      // Convert API sessions to TutoringSession format
      const convertedSessions: TutoringSession[] = await Promise.all(
        apiSessions.map(async (s: any) => {
          // Load student profile
          let studentName = "Unknown Student";
          let studentEmail = s.studentEmail || "";
          try {
            if (s.studentUuid) {
              const studentProfile: any = await profileService.getUserProfile(s.studentUuid);
              studentName = `${studentProfile.firstName || ""} ${studentProfile.lastName || ""}`.trim();
              studentEmail = studentProfile.email || studentEmail;
            }
          } catch (error) {
            console.error("Failed to load student profile:", error);
          }
          
          return {
            id: s.sessionId,
            studentId: s.studentId,
            tutorId: s.tutorId || tutorIdParam,
            studentName: studentName,
            studentEmail: studentEmail,
            subjectId: s.subjectId || "unknown",
            subjectCode: "",
            status: s.status.toLowerCase() === "confirmed" || s.status.toLowerCase() === "pending_tutor_approval" ? "active" : s.status.toLowerCase() as "active" | "completed" | "cancelled",
            startDate: s.startTime ? new Date(s.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            duration: "63w",
            meetings: [{
              id: s.sessionId,
              date: s.startTime ? new Date(s.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              time: s.startTime ? new Date(s.startTime).toTimeString().split(' ')[0].substring(0, 5) : "00:00",
              duration: 60,
              type: s.mode === "ONLINE" ? "online" : "offline" as "online" | "offline",
              zoomLink: s.mode === "ONLINE" ? s.locationOrLink : undefined,
              attended: s.status === "COMPLETED",
              notes: "",
            }],
            attendance: s.status === "COMPLETED" ? 100 : 0,
            progress: 0,
            lastMeeting: s.startTime || new Date().toISOString(),
            nextMeeting: s.status === "CONFIRMED" ? s.startTime : undefined,
          };
        })
      );
      
      setSessions(convertedSessions);
      toast.success(`Loaded ${convertedSessions.length} session(s)`);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Failed to load sessions");
    }
  };
  
  const loadFeedbackStats = async (tutorIdParam: string) => {
    try {
      const stats = await feedbackService.getTutorFeedbackStats(tutorIdParam);
      setFeedbackStats(stats);
    } catch (error) {
      console.error("Failed to load feedback stats:", error);
    }
  };

  // Meeting notes and materials state
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [showMaterialsDialog, setShowMaterialsDialog] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "library-link">("file");
  const [materialName, setMaterialName] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialTags, setMaterialTags] = useState("");
  const [materialVisibility, setMaterialVisibility] = useState<
    "private" | "shared"
  >("shared");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sessionMaterials, setSessionMaterials] = useState<SessionMaterial[]>(
    []
  );

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("60");
  const [scheduleType, setScheduleType] = useState<"online" | "offline">(
    "online"
  );
  const [scheduleLocation, setScheduleLocation] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");

  const activeSessions = sessions.filter(s => s.status === "active");
  const completedSessions = sessions.filter(s => s.status === "completed");
  const cancelledSessions = sessions.filter(s => s.status === "cancelled");

  const session = sessions.find(s => s.id === selectedSession);
  const studentFeedback: {rating: number; comment: string; recommended: boolean; timestamp: string} | null = null; // TODO: Load from API

  // Calculate session statistics
  const getSessionStats = (session: TutoringSession) => {
    const totalMeetings = session.meetings.length;
    const attendedMeetings = session.meetings.filter(m => m.attended).length;
    const attendanceRate =
      totalMeetings > 0 ? (attendedMeetings / totalMeetings) * 100 : 0;

    return {
      totalMeetings,
      attendedMeetings,
      attendanceRate,
    };
  };

  // Get subject details
  const getSubjectDetails = (subjectId: string) => {
    // TODO: Load from API when subject API is available
    return { id: subjectId, code: subjectId.toUpperCase(), name: subjectId };
  };

  const handleSaveProgress = () => {
    if (!selectedSession) return;

    setSavingProgress(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Progress notes saved successfully", {
        description: "Student progress log has been updated",
      });
      setSavingProgress(false);
    }, 1000);
  };

  // Handle saving meeting notes
  const handleSaveMeetingNotes = () => {
    if (!meetingNotes.trim()) {
      toast.error("Please enter meeting notes");
      return;
    }

    // Simulate saving to database
    const session = sessions.find(s => s.id === selectedSession);
    if (session) {
      // Update the session with notes
      toast.success("Meeting notes saved successfully", {
        description: "Notes have been added to the session record",
      });
      setShowNotesDialog(false);
      setMeetingNotes("");
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Validate file types (PDFs, docs, presentations)
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      const invalidFiles = fileArray.filter(f => !validTypes.includes(f.type));
      if (invalidFiles.length > 0) {
        toast.error("Invalid file type", {
          description: "Only PDF, Word, and PowerPoint files are allowed",
        });
        return;
      }

      // Validate file size (max 10MB per file)
      const largeFiles = fileArray.filter(f => f.size > 10 * 1024 * 1024);
      if (largeFiles.length > 0) {
        toast.error("File too large", {
          description: "Maximum file size is 10MB per file",
        });
        return;
      }

      setSelectedFiles(fileArray);
      toast.success(`${fileArray.length} file(s) selected`);
    }
  };

  // Handle saving materials
  const handleSaveMaterials = () => {
    if (uploadType === "file" && selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (uploadType === "library-link" && !materialUrl.trim()) {
      toast.error("Please enter a library resource link");
      return;
    }

    // Create new materials
    const newMaterials: SessionMaterial[] =
      uploadType === "file"
        ? selectedFiles.map((file, index) => ({
            id: `mat-${Date.now()}-${index}`,
            name: file.name,
            type: "file" as const,
            fileType: file.type,
            fileSize: file.size,
            url: URL.createObjectURL(file), // In real app, this would be the uploaded URL
            description: materialDescription,
            tags: materialTags
              .split(",")
              .map(t => t.trim())
              .filter(Boolean),
            visibility: materialVisibility,
            uploadedAt: new Date().toISOString(),
            uploadedBy: "tutor1", // Current tutor ID
          }))
        : [
            {
              id: `mat-${Date.now()}`,
              name: materialName,
              type: "library-link" as const,
              url: materialUrl,
              description: materialDescription,
              tags: materialTags
                .split(",")
                .map(t => t.trim())
                .filter(Boolean),
              visibility: materialVisibility,
              uploadedAt: new Date().toISOString(),
              uploadedBy: "tutor1",
            },
          ];

    setSessionMaterials([...sessionMaterials, ...newMaterials]);

    // Reset form
    setSelectedFiles([]);
    setMaterialName("");
    setMaterialUrl("");
    setMaterialDescription("");
    setMaterialTags("");
    setMaterialVisibility("shared");
    setShowMaterialsDialog(false);

    toast.success("Materials uploaded successfully");
  };

  // Handle save and notify students
  const handleSaveAndNotify = () => {
    if (!selectedSession) return;

    // Simulate saving to database and sending notifications
    const session = sessions.find(s => s.id === selectedSession);
    if (session) {
      toast.success("Session updated successfully!", {
        description: `Notification sent to ${session.studentName}. All materials and notes have been saved.`,
      });

      // Reset states
      setMeetingNotes("");
      setSessionMaterials([]);
    }
  };

  // Handle schedule confirmation
  const handleConfirmSchedule = () => {
    if (!scheduleDate) {
      toast.error("Please select a date");
      return;
    }
    if (!scheduleTime) {
      toast.error("Please select a time");
      return;
    }
    if (scheduleType === "offline" && !scheduleLocation.trim()) {
      toast.error("Please enter a location for offline meeting");
      return;
    }

    const session = sessions.find(s => s.id === selectedSession);
    if (session) {
      // Format the schedule details
      const scheduleDateTime = new Date(scheduleDate);
      const [hours, minutes] = scheduleTime.split(":");
      scheduleDateTime.setHours(parseInt(hours), parseInt(minutes));

      toast.success("Session scheduled successfully!", {
        description: `${session.studentName} will be notified about the new session on ${scheduleDateTime.toLocaleDateString()} at ${scheduleTime}`,
      });

      // Reset schedule form
      setScheduleDate(undefined);
      setScheduleTime("");
      setScheduleDuration("60");
      setScheduleType("online");
      setScheduleLocation("");
      setScheduleNotes("");
    }
  };

  // Handle schedule cancellation
  const handleCancelSchedule = () => {
    setScheduleDate(undefined);
    setScheduleTime("");
    setScheduleDuration("60");
    setScheduleType("online");
    setScheduleLocation("");
    setScheduleNotes("");
    toast.info("Schedule form cleared");
  };

  // Use feedback stats from API
  const recommendRate = (feedbackStats?.totalFeedback || 0) > 0 ? 100 : 0; // Mock 100% for now

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Tutoring Sessions
          </h1>
          <p className="text-gray-600">
            View and manage your tutoring sessions with students
          </p>
        </div>

        {/* Feedback Stats Card */}
        {feedbackStats && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">
                      {feedbackStats.averageRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-yellow-700">Avg Rating</p>
                  </div>
                </div>
                <div className="border-l border-yellow-300 pl-4">
                  <p className="text-2xl font-bold text-orange-900">
                    {recommendRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-orange-700">Recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Active Sessions ({activeSessions.length})
        </h2>
        {activeSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No active sessions
              </h3>
              <p className="text-gray-500">
                You don't have any active tutoring sessions at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map(session => {
              const stats = getSessionStats(session);
              const subject = getSubjectDetails(session.subjectId);

              return (
                <Card
                  key={session.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`}
                          />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base mb-1">
                            {session.studentName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-2">
                            {session.subjectName}
                          </p>
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
                        <p className="text-xl font-semibold text-blue-600">
                          {stats.totalMeetings}
                        </p>
                        <p className="text-xs text-gray-600">Meetings</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-xl font-semibold text-green-600">
                          {stats.attendanceRate.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-600">Attendance</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <p className="text-xl font-semibold text-purple-600">
                          {Math.floor(
                            (Date.now() -
                              new Date(session.startDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 7)
                          )}
                          w
                        </p>
                        <p className="text-xs text-gray-600">Duration</p>
                      </div>
                    </div>

                    {/* Latest Meeting */}
                    {session.meetings.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-medium text-gray-600 mb-2">
                          Latest Meeting
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">
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
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session.id);
                          setSelectedTab("progress");
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Completed Sessions ({completedSessions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.map(session => {
              const stats = getSessionStats(session);
              const subject = getSubjectDetails(session.subjectId);
              const feedback: { rating: number; comment: string; recommended: boolean } | null = null; // TODO: Load individual session feedback from API

              return (
                <Card
                  key={session.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.studentId}`}
                          />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base mb-1">
                            {session.studentName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-2">
                            {session.subjectName}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {subject?.code}
                            </Badge>
                            {feedback && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">
                                  {feedback.rating}.0
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-gray-500 text-white"
                      >
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Session Summary */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <span className="text-gray-600">Meetings:</span>
                          <span className="ml-1 font-semibold text-gray-900">
                            {stats.totalMeetings}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attended:</span>
                          <span className="ml-1 font-semibold text-gray-900">
                            {stats.attendedMeetings}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rate:</span>
                          <span className="ml-1 font-semibold text-gray-900">
                            {stats.attendanceRate.toFixed(0)}%
                          </span>
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
                              <h4 className="text-green-900 text-sm font-medium">
                                Student Feedback
                              </h4>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= feedback.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-green-800 text-xs line-clamp-2">
                              {feedback.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSession(session.id);
                        setSelectedTab("feedback");
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
      <Dialog
        open={!!selectedSession}
        onOpenChange={() => setSelectedSession(null)}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.studentId}`}
                />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {session?.studentName}
                </h3>
                <p className="text-sm text-gray-600">{session?.subjectName}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mt-4"
          >
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 p-1">
              <TabsTrigger value="progress" className="flex-1 min-w-[100px]">
                Progress
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 min-w-[120px]">
                Meeting Notes
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex-1 min-w-[100px]">
                Materials
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1 min-w-[130px]">
                Coming Schedule
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex-1 min-w-[130px]">
                Student Feedback
              </TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
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
                          <p className="text-3xl font-bold text-blue-600">
                            {getSessionStats(session).totalMeetings}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Total Meetings
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {getSessionStats(session).attendedMeetings}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Attended</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            {getSessionStats(session).attendanceRate.toFixed(0)}
                            %
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Attendance Rate
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                          <p className="text-3xl font-bold text-orange-600">
                            {Math.floor(
                              (Date.now() -
                                new Date(session.startDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 7)
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Weeks Active
                          </p>
                        </div>
                      </div>

                      {/* Meeting History */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-3">
                          Meeting History
                        </h4>
                        <div className="space-y-2">
                          {session.meetings.map(meeting => (
                            <div
                              key={meeting.id}
                              className={`p-4 rounded-lg border-2 ${
                                meeting.attended
                                  ? "border-green-200 bg-green-50"
                                  : "border-orange-200 bg-orange-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {new Date(
                                        meeting.date
                                      ).toLocaleDateString()}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
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
                                    <span className="text-sm font-medium">
                                      Attended
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-orange-600">
                                    <XCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">
                                      Absent
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Notes */}
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">
                          Student Progress Assessment
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <Label>Progress Notes</Label>
                            <Textarea
                              value={progressNotes[session.id] || ""}
                              onChange={e =>
                                setProgressNotes({
                                  ...progressNotes,
                                  [session.id]: e.target.value,
                                })
                              }
                              placeholder="Document student progress, strengths, areas for improvement, and learning outcomes..."
                              className="mt-2 min-h-[120px]"
                            />
                          </div>
                          <Button
                            onClick={handleSaveProgress}
                            disabled={savingProgress}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {savingProgress
                              ? "Saving..."
                              : "Save Progress Notes"}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coming Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Schedule New Session
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-2">
                    Create a new tutoring session without student intervention
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Session Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !scheduleDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduleDate
                            ? scheduleDate.toLocaleDateString()
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time">Start Time *</Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduleTime}
                        onChange={e => setScheduleTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-duration">
                        Duration (minutes) *
                      </Label>
                      <Select
                        value={scheduleDuration}
                        onValueChange={setScheduleDuration}
                      >
                        <SelectTrigger id="schedule-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Meeting Type */}
                  <div className="space-y-2">
                    <Label>Meeting Type *</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={
                          scheduleType === "online" ? "default" : "outline"
                        }
                        className={`w-full ${scheduleType === "online" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        onClick={() => setScheduleType("online")}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Online
                      </Button>
                      <Button
                        type="button"
                        variant={
                          scheduleType === "offline" ? "default" : "outline"
                        }
                        className={`w-full ${scheduleType === "offline" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        onClick={() => setScheduleType("offline")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Offline
                      </Button>
                    </div>
                  </div>

                  {/* Location (for offline) */}
                  {scheduleType === "offline" && (
                    <div className="space-y-2">
                      <Label htmlFor="schedule-location">Location *</Label>
                      <Input
                        id="schedule-location"
                        placeholder="e.g., CS1 Building, Room 201"
                        value={scheduleLocation}
                        onChange={e => setScheduleLocation(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Meeting Link (for online) */}
                  {scheduleType === "online" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Video className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Online Meeting Link
                          </p>
                          <p className="text-xs text-blue-700">
                            A video conference link will be automatically
                            generated and shared with the student after
                            confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Session Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="schedule-notes">
                      Session Notes (Optional)
                    </Label>
                    <Textarea
                      id="schedule-notes"
                      placeholder="Add any notes or topics to be covered in this session..."
                      value={scheduleNotes}
                      onChange={e => setScheduleNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Summary Card */}
                  {scheduleDate && scheduleTime && (
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Schedule Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">
                            {scheduleDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">
                            {scheduleTime} ({scheduleDuration} minutes)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {scheduleType === "online" ? (
                            <Video className="w-4 h-4 text-gray-600" />
                          ) : (
                            <User className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-gray-700">
                            {scheduleType === "online"
                              ? "Online Session"
                              : `Offline at ${scheduleLocation || "TBD"}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleCancelSchedule}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmSchedule}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meeting Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Meeting Notes & Topics Covered</CardTitle>
                  <Button onClick={() => setShowNotesDialog(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meeting Notes
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {session?.meetings
                      .filter(m => m.notes || m.meetingNotes)
                      .map(meeting => (
                        <div
                          key={meeting.id}
                          className="p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
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
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {meeting.meetingNotes || meeting.notes}
                          </p>
                        </div>
                      ))}
                    {session?.meetings.filter(m => m.notes || m.meetingNotes)
                      .length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No meeting notes available
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Click "Add Meeting Notes" to get started
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Session Materials & Resources</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload files or link library resources
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowMaterialsDialog(true)}
                    size="sm"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Materials
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessionMaterials.length > 0 ? (
                      sessionMaterials.map(material => (
                        <div
                          key={material.id}
                          className="p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              {material.type === "file" ? (
                                <File className="w-6 h-6 text-blue-600" />
                              ) : (
                                <LinkIcon className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {material.name}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {material.fileType && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {material.fileType}
                                      </Badge>
                                    )}
                                    {material.fileSize && (
                                      <span className="text-xs text-gray-500">
                                        {(
                                          material.fileSize /
                                          (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                      </span>
                                    )}
                                    <Badge
                                      variant={
                                        material.visibility === "shared"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {material.visibility === "shared" ? (
                                        <>
                                          <Eye className="w-3 h-3 mr-1" />{" "}
                                          Shared
                                        </>
                                      ) : (
                                        <>
                                          <EyeOff className="w-3 h-3 mr-1" />{" "}
                                          Private
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                              {material.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {material.description}
                                </p>
                              )}
                              {material.tags && material.tags.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {material.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                Uploaded{" "}
                                {new Date(
                                  material.uploadedAt
                                ).toLocaleDateString()}{" "}
                                by {material.uploadedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No materials uploaded yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Upload study materials to share with your student
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save and Notify Button */}
              {sessionMaterials.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAndNotify}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Save and Notify Student
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Student Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              {/* TODO: Load student feedback from API */}
              {false ? (
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
                        <p className="text-5xl font-bold text-yellow-900 mb-2">
                          {studentFeedback.rating}.0
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= studentFeedback.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Rating:{" "}
                          {studentFeedback.rating === 5
                            ? "Excellent"
                            : studentFeedback.rating === 4
                              ? "Very Good"
                              : studentFeedback.rating === 3
                                ? "Good"
                                : studentFeedback.rating === 2
                                  ? "Fair"
                                  : "Poor"}
                        </p>
                      </div>
                    </div>

                    {/* Feedback Comment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Student Comments
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-gray-900 leading-relaxed">
                          {studentFeedback.comment}
                        </p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Recommendation Status
                      </h4>
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          studentFeedback.recommended
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {studentFeedback.recommended ? (
                            <>
                              <ThumbsUp className="w-6 h-6 text-green-600" />
                              <div>
                                <p className="text-green-900 font-medium">
                                  Recommended to Other Students
                                </p>
                                <p className="text-sm text-green-700">
                                  Student would recommend your tutoring services
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-6 h-6 text-red-600" />
                              <div>
                                <p className="text-red-900 font-medium">
                                  Not Recommended
                                </p>
                                <p className="text-sm text-red-700">
                                  Student would not recommend your tutoring
                                  services
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feedback Date */}
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Feedback submitted on{" "}
                        {new Date(
                          studentFeedback.timestamp
                        ).toLocaleDateString()}
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
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Feedback Yet
                    </h3>
                    <p className="text-gray-500">
                      {session?.status === "active"
                        ? "Student will be able to provide feedback after the session is completed"
                        : "Student has not provided feedback for this session"}
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
                          <p className="text-3xl font-bold text-blue-900">
                            {feedbackStats.averageRating.toFixed(1)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-xs text-gray-500 mt-1">
                          From {feedbackStats.totalFeedback} students
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <ThumbsUp className="w-6 h-6 text-green-600" />
                          <p className="text-3xl font-bold text-green-900">
                            {recommendRate.toFixed(0)}%
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Recommendation Rate
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Students who recommend you
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                          <p className="text-3xl font-bold text-purple-900">
                            {feedbackStats.totalFeedback}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">Total Feedback</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Completed sessions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Meeting Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Meeting Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-notes">Meeting Notes</Label>
              <Textarea
                id="meeting-notes"
                placeholder="Enter detailed notes about the meeting...&#10;&#10;Topics covered:&#10;- &#10;&#10;Student progress:&#10;- &#10;&#10;Next steps:&#10;- "
                value={meetingNotes}
                onChange={e => setMeetingNotes(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Include topics discussed, student progress observations, and
                action items
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMeetingNotes}>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Materials Dialog */}
      <Dialog open={showMaterialsDialog} onOpenChange={setShowMaterialsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Session Materials</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Upload Type Selection */}
            <div className="space-y-2">
              <Label>Material Type</Label>
              <Tabs
                value={uploadType}
                onValueChange={(v: string) =>
                  setUploadType(v as "file" | "library-link")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                  <TabsTrigger value="library-link">
                    HCMUT Library Link
                  </TabsTrigger>
                </TabsList>

                {/* File Upload */}
                <TabsContent value="file" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-900 font-medium">
                            {selectedFiles[0].name}
                          </span>
                          <span className="text-xs text-blue-600">
                            (
                            {(selectedFiles[0].size / (1024 * 1024)).toFixed(2)}{" "}
                            MB)
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, Word, PowerPoint (Max 10MB)
                    </p>
                  </div>
                </TabsContent>

                {/* Library Link */}
                <TabsContent value="library-link" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="library-url">Library Resource URL</Label>
                    <Input
                      id="library-url"
                      type="url"
                      placeholder="https://library.hcmut.edu.vn/..."
                      value={materialUrl}
                      onChange={e => setMaterialUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Paste the URL from HCMUT Library system
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material-name">Resource Name</Label>
                    <Input
                      id="material-name"
                      placeholder="e.g., Data Structures Chapter 5"
                      value={materialName}
                      onChange={e => setMaterialName(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Common Fields */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="material-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="material-description"
                  placeholder="Brief description of the material and how it relates to the session..."
                  value={materialDescription}
                  onChange={e => setMaterialDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material-tags">Tags (Optional)</Label>
                <Input
                  id="material-tags"
                  placeholder="e.g., homework, practice, reference"
                  value={materialTags}
                  onChange={e => setMaterialTags(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Separate tags with commas
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="share-with-student"
                    checked={materialVisibility === "shared"}
                    onChange={e =>
                      setMaterialVisibility(
                        e.target.checked ? "shared" : "private"
                      )
                    }
                    className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                  />
                </label>
                <Label
                  htmlFor="share-with-student"
                  className="text-sm cursor-pointer"
                >
                  Share this material with the student
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                {materialVisibility === "shared"
                  ? "Student will be able to view and download this material"
                  : "This material will be private and only visible to you"}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMaterialsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMaterials}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
