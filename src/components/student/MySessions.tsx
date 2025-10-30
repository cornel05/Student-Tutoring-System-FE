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
  AlertCircle
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
import { toast } from 'sonner@2.0.3';

export function MySessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>(mockTutoringSessions);
  const [cancellingSession, setCancellingSession] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDetails, setCancelDetails] = useState('');

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

  const activeSessions = sessions.filter(s => s.status === 'active');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

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
    </div>
  );
}
