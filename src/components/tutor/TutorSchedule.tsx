import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Clock, 
  Plus, 
  Trash2,
  Calendar,
  MapPin,
  Video,
  Users,
  Send,
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
import { Label } from '../ui/label';
import { TimeSlot, BlackoutDate } from '../../types';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function TutorSchedule() {
  const [availability, setAvailability] = useState<TimeSlot[]>([
    { 
      id: 'a1', 
      day: 'Monday', 
      startTime: '14:00', 
      endTime: '16:00',
      mode: 'both',
      location: 'Room A5-101',
      zoomLink: 'https://zoom.us/j/123456789',
      capacity: 5,
      isPublished: true
    },
    { 
      id: 'a2', 
      day: 'Wednesday', 
      startTime: '14:00', 
      endTime: '16:00',
      mode: 'online',
      zoomLink: 'https://zoom.us/j/987654321',
      capacity: 8,
      isPublished: true
    },
    { 
      id: 'a3', 
      day: 'Friday', 
      startTime: '10:00', 
      endTime: '12:00',
      mode: 'offline',
      location: 'Room A5-102',
      capacity: 4,
      isPublished: false
    },
  ]);
  
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([
    { id: 'b1', date: '2025-12-25', reason: 'Christmas Holiday' },
    { id: 'b2', date: '2025-12-31', reason: 'New Year Preparation' }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBlackoutDialog, setShowBlackoutDialog] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    day: 'Monday',
    startTime: '14:00',
    endTime: '16:00',
    mode: 'both',
    location: '',
    zoomLink: '',
    capacity: 5,
    isPublished: false
  });
  
  const [newBlackout, setNewBlackout] = useState({
    date: '',
    reason: ''
  });

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime || newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    if (newSlot.mode === 'offline' && !newSlot.location) {
      toast.error('Please specify a location for offline sessions');
      return;
    }

    if ((newSlot.mode === 'online' || newSlot.mode === 'both') && !newSlot.zoomLink) {
      toast.error('Please provide a Zoom link for online sessions');
      return;
    }

    const slot: TimeSlot = {
      id: `a${availability.length + 1}`,
      day: newSlot.day || 'Monday',
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      mode: newSlot.mode,
      location: newSlot.location,
      zoomLink: newSlot.zoomLink,
      capacity: newSlot.capacity || 5,
      isPublished: false
    };

    setAvailability([...availability, slot]);
    toast.success('Time slot added successfully', {
      description: 'Remember to publish your availability when ready'
    });
    setShowAddDialog(false);
    setNewSlot({ 
      day: 'Monday', 
      startTime: '14:00', 
      endTime: '16:00',
      mode: 'both',
      location: '',
      zoomLink: '',
      capacity: 5,
      isPublished: false
    });
  };

  const handleRemoveSlot = (id: string) => {
    setAvailability(availability.filter(slot => slot.id !== id));
    toast.success('Time slot removed');
  };

  const handleAddBlackout = () => {
    if (!newBlackout.date || !newBlackout.reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const blackout: BlackoutDate = {
      id: `b${blackoutDates.length + 1}`,
      ...newBlackout
    };

    setBlackoutDates([...blackoutDates, blackout]);
    toast.success('Blackout date added');
    setShowBlackoutDialog(false);
    setNewBlackout({ date: '', reason: '' });
  };

  const handleRemoveBlackout = (id: string) => {
    setBlackoutDates(blackoutDates.filter(b => b.id !== id));
    toast.success('Blackout date removed');
  };

  const handlePublishAvailability = () => {
    const unpublished = availability.filter(slot => !slot.isPublished);
    
    if (unpublished.length === 0) {
      toast.info('All slots are already published');
      return;
    }

    setAvailability(availability.map(slot => ({ ...slot, isPublished: true })));
    toast.success('Availability published!', {
      description: `${unpublished.length} slot(s) are now visible to students`
    });
  };

  // Group by day
  const scheduleByDay = DAYS.map(day => ({
    day,
    slots: availability.filter(slot => slot.day === day)
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Manage Schedule</h1>
          <p className="text-gray-600">Set your available time slots for tutoring</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowBlackoutDialog(true)} 
            variant="outline"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add Blackout Date
          </Button>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Time Slot
          </Button>
        </div>
      </div>

      {/* Publish Button */}
      {availability.some(slot => !slot.isPublished) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-900">You have unpublished time slots</p>
                  <p className="text-sm text-blue-700">
                    Publish your availability to make it visible to students
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePublishAvailability}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Publish Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleByDay.map(({ day, slots }) => (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-900">{day}</h3>
                  <Badge variant="outline">
                    {slots.length} {slots.length === 1 ? 'slot' : 'slots'}
                  </Badge>
                </div>
                {slots.length > 0 ? (
                  <div className="space-y-2">
                    {slots.map((slot) => (
                      <div 
                        key={slot.id}
                        className={`p-4 rounded-lg border-2 ${
                          slot.isPublished 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 ${slot.isPublished ? 'text-blue-600' : 'text-gray-600'}`} />
                              <span className={slot.isPublished ? 'text-blue-900' : 'text-gray-900'}>
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <Badge variant={slot.isPublished ? 'default' : 'secondary'}>
                                {slot.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                {slot.mode === 'online' && <Video className="w-4 h-4" />}
                                {slot.mode === 'offline' && <MapPin className="w-4 h-4" />}
                                {slot.mode === 'both' && (
                                  <>
                                    <Video className="w-4 h-4" />
                                    <MapPin className="w-4 h-4" />
                                  </>
                                )}
                                <span className="capitalize">{slot.mode}</span>
                              </div>
                              
                              {slot.location && (
                                <span className="text-gray-600">📍 {slot.location}</span>
                              )}
                              
                              {slot.capacity && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Users className="w-4 h-4" />
                                  <span>Max {slot.capacity} students</span>
                                </div>
                              )}
                            </div>
                            
                            {slot.zoomLink && (
                              <p className="text-xs text-gray-500 truncate">
                                🔗 {slot.zoomLink}
                              </p>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No availability set for this day
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blackout Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Blackout Dates & Exceptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blackoutDates.length > 0 ? (
            <div className="space-y-2">
              {blackoutDates.map((blackout) => (
                <div 
                  key={blackout.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="text-red-900">{blackout.date}</p>
                    <p className="text-sm text-red-700">{blackout.reason}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveBlackout(blackout.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No blackout dates set
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 mb-2">Availability Summary</h3>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl text-blue-600">{availability.length}</p>
                  <p className="text-sm text-blue-800">Total Slots</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-green-600">
                    {availability.filter(s => s.isPublished).length}
                  </p>
                  <p className="text-sm text-green-800">Published</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-orange-600">{blackoutDates.length}</p>
                  <p className="text-sm text-orange-800">Blackout Dates</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Available Time Slot</DialogTitle>
            <DialogDescription>
              Set a recurring weekly time when you're available for tutoring
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Day Selection */}
            <div>
              <Label>Day of Week</Label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <select
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
                >
                  {TIME_SLOTS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>End Time</Label>
                <select
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
                >
                  {TIME_SLOTS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mode Selection */}
            <div>
              <Label>Session Mode</Label>
              <Select 
                value={newSlot.mode} 
                onValueChange={(value: 'online' | 'offline' | 'both') => 
                  setNewSlot({ ...newSlot, mode: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>Online (Zoom)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Offline (In-person)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <MapPin className="w-4 h-4" />
                      <span>Both (Hybrid)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location (for offline/both) */}
            {(newSlot.mode === 'offline' || newSlot.mode === 'both') && (
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  value={newSlot.location}
                  onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                  placeholder="e.g., Room A5-101, Building H6"
                  className="mt-2"
                />
              </div>
            )}

            {/* Zoom Link (for online/both) */}
            {(newSlot.mode === 'online' || newSlot.mode === 'both') && (
              <div>
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Zoom Link
                </Label>
                <Input
                  value={newSlot.zoomLink}
                  onChange={(e) => setNewSlot({ ...newSlot, zoomLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="mt-2"
                />
              </div>
            )}

            {/* Capacity */}
            <div>
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Maximum Students per Slot
              </Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={newSlot.capacity}
                onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 5 })}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of students who can book this time slot
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSlot} className="bg-blue-600 hover:bg-blue-700">
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Blackout Date Dialog */}
      <Dialog open={showBlackoutDialog} onOpenChange={setShowBlackoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Blackout Date</DialogTitle>
            <DialogDescription>
              Block a specific date when you won't be available
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={newBlackout.date}
                onChange={(e) => setNewBlackout({ ...newBlackout, date: e.target.value })}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label>Reason</Label>
              <Input
                value={newBlackout.reason}
                onChange={(e) => setNewBlackout({ ...newBlackout, reason: e.target.value })}
                placeholder="e.g., Conference, Holiday, Personal Leave"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlackoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBlackout} className="bg-blue-600 hover:bg-blue-700">
              Add Blackout Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
