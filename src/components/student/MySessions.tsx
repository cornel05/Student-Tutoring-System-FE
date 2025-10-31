import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
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
  ThumbsUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { mockTutoringSessions } from '../../data/mockData';
import { TutoringSession } from '../../types';
import { toast } from 'sonner';

export function MySessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>(mockTutoringSessions);
  const [cancellingSession, setCancellingSession] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDetails, setCancelDetails] = useState('');
  const [feedbackSession, setFeedbackSession] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [recommendTutor, setRecommendTutor] = useState<boolean | null>(null);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<Record<string, { rating: number; comment: string; recommended: boolean }>>({});

  const handleCancelRequest = () => {
    if (!cancelReason.trim()) {
      toast.error('Please select a reason');
      return;
    }
    if (!cancelDetails.trim()) {
      toast.error('Please provide more details');
      return;
    }

    // Update session status
    setSessions(prev => prev.map(s => 
      s.id === cancellingSession 
        ? { ...s, status: 'cancelled' as const }
        : s
    ));

    toast.success('Cancellation request submitted', {
      description: 'Your tutor will be notified'
    });

    setCancellingSession(null);
    setCancelReason('');
    setCancelDetails('');
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!feedbackComment.trim()) {
      toast.error('Please provide feedback comments');
      return;
    }
    if (recommendTutor === null) {
      toast.error('Please indicate if you would recommend this tutor');
      return;
    }

    // Save feedback
    setSessionFeedbacks(prev => ({
      ...prev,
      [feedbackSession!]: {
        rating: feedbackRating,
        comment: feedbackComment,
        recommended: recommendTutor
      }
    }));

    toast.success('Feedback submitted successfully', {
      description: 'Thank you for your feedback!'
    });

    setFeedbackSession(null);
    setFeedbackRating(0);
    setFeedbackComment('');
    setRecommendTutor(null);
  };

  const activeSessions = sessions.filter(s => s.status === 'active');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Tutoring Sessions</h1>
        <p className="text-gray-600">View and manage your active tutoring sessions</p>
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-gray-900 mb-4">Active Sessions ({activeSessions.length})</h2>
        {activeSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">No active sessions</h3>
              <p className="text-gray-500 mb-4">You don't have any active tutoring sessions yet</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Register for Tutoring
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => (
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
                          Since {new Date(session.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meetings */}
                  <div>
                    <h4 className="text-sm text-gray-600 mb-3">Meeting History</h4>
                    <div className="space-y-2">
                      {session.meetings.map((meeting) => (
                        <div 
                          key={meeting.id}
                          className={`p-3 rounded-lg border ${
                            meeting.attended 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-orange-200 bg-orange-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm text-gray-900">
                                  {new Date(meeting.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {meeting.time} ({meeting.duration} min)
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {meeting.type}
                                </Badge>
                              </div>
                              {meeting.notes && (
                                <p className="text-sm text-gray-600 mt-2">{meeting.notes}</p>
                              )}
                              {meeting.zoomLink && (
                                <a 
                                  href={meeting.zoomLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                                >
                                  <Video className="w-3 h-3" />
                                  Join Zoom Meeting
                                </a>
                              )}
                            </div>
                            {meeting.attended ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Tutor
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setCancellingSession(session.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancelled Sessions */}
      {cancelledSessions.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Cancelled Sessions ({cancelledSessions.length})</h2>
          <div className="space-y-4">
            {cancelledSessions.map((session) => (
              <Card key={session.id} className="opacity-60">
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
                      </div>
                    </div>
                    <Badge variant="secondary">Cancelled</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Past Sessions ({pastSessions.length})</h2>
          <div className="space-y-4">
            {pastSessions.map((session) => {
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
                            {new Date(session.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-500 text-white">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Meeting Summary */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Session Summary</span>
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
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Meetings:</span>
                          <span className="ml-2 text-gray-900">{session.meetings.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attended:</span>
                          <span className="ml-2 text-gray-900">{session.meetings.filter(m => m.attended).length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attendance Rate:</span>
                          <span className="ml-2 text-gray-900">
                            {Math.round((session.meetings.filter(m => m.attended).length / session.meetings.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    {hasFeedback && (
                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <ThumbsUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-green-900 text-sm mb-2 flex items-center gap-2">
                              Your Feedback
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= hasFeedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </h4>
                            <p className="text-green-800 text-sm mb-2">{hasFeedback.comment}</p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-300">
                              <Badge className={hasFeedback.recommended ? 'bg-green-600' : 'bg-gray-500'}>
                                {hasFeedback.recommended ? '✓ Recommended to other students' : '✗ Not recommended'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={!!cancellingSession} onOpenChange={() => setCancellingSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Cancel Tutoring Session
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this session. This helps us improve our service.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Reason for Cancellation *</Label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
              >
                <option value="">Select a reason...</option>
                <option value="schedule">Schedule conflict</option>
                <option value="improved">My grades have improved</option>
                <option value="method">Teaching method not suitable</option>
                <option value="personal">Personal reasons</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label>Additional Details *</Label>
              <Textarea
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                placeholder="Please provide more details about your reason for cancelling..."
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellingSession(null)}>
              Keep Session
            </Button>
            <Button 
              onClick={handleCancelRequest}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={!!feedbackSession} onOpenChange={() => setFeedbackSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Session Feedback
            </DialogTitle>
            <DialogDescription>
              Share your experience with this tutoring session. Your feedback helps improve the quality of tutoring services.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Overall Rating *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 cursor-pointer transition-colors ${
                        star <= feedbackRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {feedbackRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {feedbackRating === 1 && 'Poor - Not satisfied'}
                  {feedbackRating === 2 && 'Fair - Below expectations'}
                  {feedbackRating === 3 && 'Good - Met expectations'}
                  {feedbackRating === 4 && 'Very Good - Above expectations'}
                  {feedbackRating === 5 && 'Excellent - Exceeded expectations'}
                </p>
              )}
            </div>

            <div>
              <Label>Your Feedback *</Label>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share your thoughts about the tutoring session, teaching quality, materials, communication, etc..."
                className="mt-2 min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your feedback will help other students and improve the tutoring system
              </p>
            </div>

            <div>
              <Label>Would you recommend this tutor to other students? *</Label>
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setRecommendTutor(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    recommendTutor === true
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                  }`}
                >
                  <ThumbsUp className={`w-6 h-6 mx-auto mb-2 ${recommendTutor === true ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="text-sm">Yes, I recommend</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRecommendTutor(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    recommendTutor === false
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                  }`}
                >
                  <XCircle className={`w-6 h-6 mx-auto mb-2 ${recommendTutor === false ? 'text-red-600' : 'text-gray-400'}`} />
                  <p className="text-sm">No, I don't recommend</p>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your recommendation helps other students choose the right tutor
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFeedbackSession(null);
              setFeedbackRating(0);
              setFeedbackComment('');
              setRecommendTutor(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleFeedbackSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
