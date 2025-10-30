import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  Plus, 
  Trash2,
  Calendar
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
import { TimeSlot } from '../../types';
import { toast } from 'sonner@2.0.3';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function TutorSchedule() {
  const [availability, setAvailability] = useState<TimeSlot[]>([
    { id: 'a1', day: 'Monday', startTime: '14:00', endTime: '16:00' },
    { id: 'a2', day: 'Wednesday', startTime: '14:00', endTime: '16:00' },
    { id: 'a3', day: 'Friday', startTime: '10:00', endTime: '12:00' },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '14:00',
    endTime: '16:00'
  });

  const handleAddSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    const slot: TimeSlot = {
      id: `a${availability.length + 1}`,
      ...newSlot
    };

    setAvailability([...availability, slot]);
    toast.success('Time slot added successfully');
    setShowAddDialog(false);
    setNewSlot({ day: 'Monday', startTime: '14:00', endTime: '16:00' });
  };

  const handleRemoveSlot = (id: string) => {
    setAvailability(availability.filter(slot => slot.id !== id));
    toast.success('Time slot removed');
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
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

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
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-900">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-blue-900 mb-2">Total Availability</h3>
              <p className="text-blue-800">
                You have {availability.length} time {availability.length === 1 ? 'slot' : 'slots'} available per week.
                Students can view and register for these times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Available Time Slot</DialogTitle>
            <DialogDescription>
              Set a recurring weekly time when you're available for tutoring
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
    </div>
  );
}
