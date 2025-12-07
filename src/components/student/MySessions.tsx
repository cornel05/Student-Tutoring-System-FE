import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Calendar,
  Video,
  CheckCircle2,
  XCircle,
  User,
  BookOpen,
  MessageSquare,
  AlertCircle,
  Star,
  ThumbsUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { TutoringSession } from "../../types";
interface FeedbackSession {
  sessionId: string;
  tutorName?: string;
  studentName?: string;
  // thêm field gì bạn dùng thì để vào
}
export function MySessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancellingSession, setCancellingSession] = useState<string | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [feedbackSession, setFeedbackSession] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [recommendTutor, setRecommendTutor] = useState<boolean | null>(null);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<
    Record<string, { rating: number; comment: string; recommended: boolean }>
  >({});
  const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const studentId = currentUser.studentId || "2110001";
  async function submitFeedback(feedback) {
    const res = await fetch(
      `/api/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      }
    );

    if (!res.ok) throw new Error("Failed to submit feedback");

    return res.json();
  }
  const handleFeedbackSubmit = async () => {
    try {
      if (!feedbackSession) {
        toast.error("No session selected");
        return;
      }

      const payload = {
        sessionId: feedbackSession,
        rating: feedbackRating,
        comment: feedbackComment
      };

      const result = await submitFeedback(payload);

      toast.success("Feedback submitted successfully!");
      setFeedbackSession(null);  // đóng dialog
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    }
  };
  // 🟦 GỌI API BACKEND
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `/api/sessions/student/${studentId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (!res.ok) throw new Error("Cannot fetch sessions");

        const data = await res.json();

        const formatted = data.map((s: any) => ({
          id: s.sessionId,
          tutorId: s.tutorId,
          tutorName: s.tutorName,
          studentId: s.studentId,
          subjectName: s.title,
          startDate: s.startTime,
          endDate: s.endTime,
          mode: s.mode,
          locationOrLink: s.locationOrLink,
          status: s.status.toLowerCase(),
          meetings: [{ attended: true }]  // mock để tránh lỗi UI
        }));

        setSessions(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [studentId]);

  // 🟦 CANCEL SESSION
  const handleCancelRequest = () => {
    if (!cancelReason.trim()) {
      toast.error("Please select a reason");
      return;
    }
    if (!cancelDetails.trim()) {
      toast.error("Please provide more details");
      return;
    }

    setSessions(prev =>
      prev.map(s =>
        s.id === cancellingSession ? { ...s, status: "cancelled" } : s
      )
    );

    toast.success("Cancellation request submitted", {
      description: "Your tutor will be notified",
    });

    setCancellingSession(null);
    setCancelReason("");
    setCancelDetails("");
  };

  // 🟦 FEEDBACK

  if (loading) {
    return <p className="p-6">Loading sessions...</p>;
  }
  const pendingSessions = sessions.filter(s => s.status === "pending");
  const pastSessions = sessions.filter(s => s.status === "completed");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Tutoring Sessions</h1>
        <p className="text-gray-600">
          Your previous tutoring session history
        </p>
      </div>
      {/* PENDING SESSIONS */}
      {pendingSessions.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">
            Pending Sessions ({pendingSessions.length})
          </h2>

          <div className="space-y-4">
            {pendingSessions.map(session => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">

                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5" />
                        {session.subjectName}
                      </CardTitle>

                      <div className="flex flex-col gap-2 text-sm text-gray-600">

                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {session.tutorName}
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.startDate).toLocaleString()}
                        </div>

                        {/* ✅ locationOrLink */}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {session.locationOrLink}
                        </div>

                      </div>
                    </div>

                    <Badge className="bg-yellow-600 text-white">
                      Pending
                    </Badge>

                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}



      {/* PAST SESSIONS */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">
            Past Sessions ({pastSessions.length})
          </h2>
          <div className="space-y-4">
            {pastSessions.map(session => {
              const hasFeedback = sessionFeedbacks[session.id];
              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5" />
                          {session.subjectName}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {session.tutorName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.startDate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-gray-500 text-white">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {!hasFeedback && (
                      <Button
                        size="sm"
                        onClick={() => setFeedbackSession(session.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Give Feedback
                      </Button>
                    )}

                    {hasFeedback && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="text-green-900 text-sm flex items-center gap-2">
                          Feedback:
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= hasFeedback.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </h4>
                        <p className="mt-2 text-green-900">
                          {hasFeedback.comment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* FEEDBACK DIALOG */}
      <Dialog
        open={!!feedbackSession}
        onOpenChange={() => setFeedbackSession(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Rating *</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setFeedbackRating(star)}>
                    <Star
                      className={`w-8 h-8 ${star <= feedbackRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Comment *</Label>
              <Textarea
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleFeedbackSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
