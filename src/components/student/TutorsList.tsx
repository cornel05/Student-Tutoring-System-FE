import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  User, 
  Clock, 
  Users, 
  Star,
  Mail,
  Calendar,
  Search,
  CheckCircle2,
  MapPin,
  Video,
  ArrowLeft
} from 'lucide-react';
import { mockTutors, mockSubjects } from '../../data/mockData';
import { Tutor, TimeSlot } from '../../types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface TutorsListProps {
  onBookSession: (tutorId: string, subjectId: string, slotId: string) => void;
}

export function TutorsList({ onBookSession }: TutorsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedTutorSubject, setSelectedTutorSubject] = useState<string>('');
  const [showSlotsDialog, setShowSlotsDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const tutors = mockTutors;
  const subjects = mockSubjects;

  // Get unique subjects that have tutors
  const availableSubjects = Array.from(
    new Set(tutors.flatMap(t => t.subjects))
  ).map(subjectCode => subjects.find(s => s.code === subjectCode)).filter(Boolean);

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const getSubjectName = (code: string) => {
    return subjects.find(s => s.code === code)?.name || code;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Available Tutors</h1>
        <p className="text-gray-600">Find expert tutors to help you succeed in your studies</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Search Tutors</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or staff ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Filter by Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Subjects</option>
                {availableSubjects.map((subject) => (
                  <option key={subject!.code} value={subject!.code}>
                    {subject!.code} - {subject!.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={tutor.avatar} alt={tutor.name} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-600">{tutor.staffId}</p>
                    </div>
                    {tutor.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{tutor.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{tutor.email}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subjects */}
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Tutoring Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subjectCode) => (
                    <Badge key={subjectCode} variant="outline" className="text-xs">
                      {getSubjectName(subjectCode)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available Time Slots
                </h4>
                <div className="space-y-1">
                  {tutor.availability.map((slot) => (
                    <div key={slot.id} className="text-sm bg-blue-50 p-2 rounded">
                      <span className="text-blue-900">{slot.day}</span>
                      <span className="text-blue-700 ml-2">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {tutor.currentStudents} / {tutor.maxStudents} students
                  </span>
                </div>
                {tutor.isAcceptingStudents ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Accepting Students
                  </Badge>
                ) : (
                  <Badge variant="secondary">Full</Badge>
                )}
              </div>

              {/* Book Session Button */}
              <div className="pt-4 border-t">
                {tutor.isAcceptingStudents ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Select subject to book session:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subjectCode) => (
                        <Button
                          key={subjectCode}
                          size="sm"
                          onClick={() => {
                            setSelectedTutor(tutor);
                            setSelectedTutorSubject(subjectCode);
                            setShowSlotsDialog(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Book Session for {subjectCode}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button disabled className="w-full" variant="secondary">
                    Currently Not Available
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No tutors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Available Slots Dialog */}
      <Dialog open={showSlotsDialog} onOpenChange={setShowSlotsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Available Time Slots</DialogTitle>
            <DialogDescription>
              Select a preferred time slot for {selectedTutor?.name} - {getSubjectName(selectedTutorSubject)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedTutor?.availability.map((slot) => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSlot?.id === slot.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{slot.day}</span>
                      <Badge variant="outline" className="ml-2">
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                      {slot.requiresApproval && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approval Required
                        </Badge>
                      )}
                    </div>
                    
                    {slot.mode && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {slot.mode === 'online' || slot.mode === 'both' ? (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            <span>Online</span>
                          </div>
                        ) : null}
                        {slot.mode === 'offline' || slot.mode === 'both' ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Offline</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                    
                    {slot.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{slot.location}</span>
                      </div>
                    )}
                    
                    {slot.zoomLink && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Video className="w-4 h-4" />
                        <span className="truncate">Zoom link available</span>
                      </div>
                    )}
                    
                    {slot.capacity && (
                      <div className="text-sm text-gray-500">
                        Capacity: {slot.capacity} students
                      </div>
                    )}
                  </div>
                  
                  {selectedSlot?.id === slot.id && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSlotsDialog(false);
                setSelectedSlot(null);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => {
                if (selectedSlot) {
                  setShowSlotsDialog(false);
                  setShowConfirmDialog(true);
                } else {
                  toast.error('Please select a time slot');
                }
              }}
              disabled={!selectedSlot}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Please review your session details before confirming
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Tutor</h4>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedTutor?.avatar} alt={selectedTutor?.name} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedTutor?.name}</p>
                  <p className="text-sm text-gray-600">{selectedTutor?.staffId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Subject</h4>
              <p className="text-gray-700">{getSubjectName(selectedTutorSubject)}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Time Slot</h4>
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{selectedSlot?.day}</span>
                  <span className="text-gray-600">
                    {selectedSlot?.startTime} - {selectedSlot?.endTime}
                  </span>
                </div>
                
                {selectedSlot?.mode && (
                  <div className="flex items-center gap-2 text-sm">
                    {selectedSlot.mode === 'online' || selectedSlot.mode === 'both' ? (
                      <Badge variant="outline" className="bg-white">
                        <Video className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    ) : null}
                    {selectedSlot.mode === 'offline' || selectedSlot.mode === 'both' ? (
                      <Badge variant="outline" className="bg-white">
                        <MapPin className="w-3 h-3 mr-1" />
                        Offline
                      </Badge>
                    ) : null}
                  </div>
                )}
                
                {selectedSlot?.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedSlot.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Approval Notice */}
            {selectedSlot?.requiresApproval && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Approval Required</h4>
                    <p className="text-sm text-yellow-800">
                      This time slot requires tutor approval. Your booking request will be sent to the tutor for review. You'll receive a notification once the tutor approves or declines your request.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setShowSlotsDialog(true);
              }}
              className="flex-1 border-2 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => {
                if (selectedTutor && selectedSlot && selectedTutorSubject) {
                  // Call the booking handler
                  onBookSession(selectedTutor.id, selectedTutorSubject, selectedSlot.id);
                  
                  // Show success notification based on approval requirement
                  if (selectedSlot.requiresApproval) {
                    toast.success('Booking Request Sent!', {
                      description: `Your request has been sent to ${selectedTutor.name}. You'll receive a notification once the tutor reviews your request.`
                    });
                  } else {
                    toast.success('Session Booked Successfully!', {
                      description: `Your session with ${selectedTutor.name} has been confirmed. Both you and the tutor will receive confirmation notifications.`
                    });
                  }
                  
                  // Reset state
                  setShowConfirmDialog(false);
                  setSelectedTutor(null);
                  setSelectedTutorSubject('');
                  setSelectedSlot(null);
                }
              }}
              className={`flex-1 border-2 ${
                selectedSlot?.requiresApproval 
                  ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-700 text-yellow-50' 
                  : 'bg-green-600 hover:bg-green-700 border-green-700 text-green-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{selectedSlot?.requiresApproval ? 'Send Approval Request' : 'Confirm Booking'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
