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
  ArrowLeft,
  Filter,
  X,
  Sparkles
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
  
  // New filter states
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [useAIRecommendations, setUseAIRecommendations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const tutors = mockTutors;
  const subjects = mockSubjects;

  // Filter options
  const campusOptions = [
    { value: 'cs1', label: 'CS1 - Lý Thường Kiệt' },
    { value: 'cs2', label: 'CS2 - Dĩ An' }
  ];

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeSlotOptions = [
    { value: '07:00-09:00', label: '7:00 AM - 9:00 AM' },
    { value: '09:00-11:00', label: '9:00 AM - 11:00 AM' },
    { value: '11:00-13:00', label: '11:00 AM - 1:00 PM' },
    { value: '13:00-15:00', label: '1:00 PM - 3:00 PM' },
    { value: '15:00-17:00', label: '3:00 PM - 5:00 PM' },
    { value: '17:00-19:00', label: '5:00 PM - 7:00 PM' },
    { value: '19:00-21:00', label: '7:00 PM - 9:00 PM' }
  ];

  const methodOptions = [
    { value: 'online', label: 'Online', icon: Video },
    { value: 'offline', label: 'Offline', icon: MapPin }
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  // Helper function to check if time slot matches filter
  const isTimeInRange = (time: string, range: string) => {
    const [rangeStart, rangeEnd] = range.split('-');
    const timeNum = parseInt(time.replace(':', ''));
    const startNum = parseInt(rangeStart.replace(':', ''));
    const endNum = parseInt(rangeEnd.replace(':', ''));
    return timeNum >= startNum && timeNum < endNum;
  };

  // Get unique subjects that have tutors
  const availableSubjects = Array.from(
    new Set(tutors.flatMap(t => t.subjects))
  ).map(subjectCode => subjects.find(s => s.code === subjectCode)).filter(Boolean);

  const filteredTutors = tutors.filter(tutor => {
    // Search filter
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject);
    
    // Campus filter (mock - assuming location contains campus info)
    const matchesCampus = selectedCampuses.length === 0 || 
      selectedCampuses.some(campus => 
        tutor.availability.some(slot => 
          slot.location?.toLowerCase().includes(campus === 'cs1' ? 'h1' : 'h2') ||
          slot.location?.toLowerCase().includes(campus === 'cs1' ? 'ly thuong kiet' : 'di an')
        )
      );
    
    // Day filter
    const matchesDay = selectedDays.length === 0 ||
      selectedDays.some(day => 
        tutor.availability.some(slot => slot.day === day)
      );
    
    // Time slot filter
    const matchesTimeSlot = selectedTimeSlots.length === 0 ||
      selectedTimeSlots.some(timeRange =>
        tutor.availability.some(slot => 
          isTimeInRange(slot.startTime, timeRange) || isTimeInRange(slot.endTime, timeRange)
        )
      );
    
    // Method filter
    const matchesMethod = selectedMethods.length === 0 ||
      selectedMethods.some(method =>
        tutor.availability.some(slot => 
          slot.mode === method || slot.mode === 'both'
        )
      );
    
    // Rating filter
    const matchesRating = selectedRatings.length === 0 ||
      (tutor.rating && selectedRatings.some(rating => tutor.rating! >= rating && tutor.rating! < rating + 1));
    
    return matchesSearch && matchesSubject && matchesCampus && matchesDay && matchesTimeSlot && matchesMethod && matchesRating;
  });

  // AI recommended tutors (mock - just sorts by rating when enabled)
  const displayTutors = useAIRecommendations 
    ? [...filteredTutors].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : filteredTutors;

  const getSubjectName = (code: string) => {
    return subjects.find(s => s.code === code)?.name || code;
  };

  // Toggle filter functions
  const toggleFilter = (value: string, selected: string[], setter: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const toggleAllCampuses = () => {
    if (selectedCampuses.length === campusOptions.length) {
      setSelectedCampuses([]);
    } else {
      setSelectedCampuses(campusOptions.map(c => c.value));
    }
  };

  const toggleAllDays = () => {
    if (selectedDays.length === dayOptions.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...dayOptions]);
    }
  };

  const toggleAllMethods = () => {
    if (selectedMethods.length === methodOptions.length) {
      setSelectedMethods([]);
    } else {
      setSelectedMethods(methodOptions.map(m => m.value));
    }
  };

  const toggleRatingFilter = (value: number) => {
    if (selectedRatings.includes(value)) {
      setSelectedRatings(selectedRatings.filter(v => v !== value));
    } else {
      setSelectedRatings([...selectedRatings, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCampuses([]);
    setSelectedDays([]);
    setSelectedTimeSlots([]);
    setSelectedMethods([]);
    setSelectedRatings([]);
    setSelectedSubject('all');
    setSearchTerm('');
  };

  const activeFilterCount = 
    selectedCampuses.length + 
    selectedDays.length + 
    selectedTimeSlots.length + 
    selectedMethods.length + 
    selectedRatings.length +
    (selectedSubject !== 'all' ? 1 : 0);


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Available Tutors</h1>
        <p className="text-gray-600">Find expert tutors to help you succeed in your studies</p>
      </div>

      {/* Search and AI Recommendations */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or staff ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* AI Recommendations Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="ai-recommendations"
                  checked={useAIRecommendations}
                  onChange={(e) => setUseAIRecommendations(e.target.checked)}
                  className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                />
              </label>
              <label
                htmlFor="ai-recommendations"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-purple-900">Use AI Recommendations</span>
                <span className="text-purple-600 text-xs">(Sort by best match)</span>
              </label>
            </div>

            {/* Filter Toggle Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge className="bg-blue-600 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {showFilters ? 'Hide' : 'Show'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Options
              </CardTitle>
              {activeFilterCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
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

            {/* Campus Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Campus</label>
                {selectedCampuses.length > 0 && (
                  <Button
                    onClick={() => setSelectedCampuses([])}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={toggleAllCampuses}
                  variant={selectedCampuses.length === campusOptions.length ? "default" : "outline"}
                  size="sm"
                  className={selectedCampuses.length === campusOptions.length ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {selectedCampuses.length === campusOptions.length && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  All Campuses
                </Button>
                {campusOptions.map((campus) => (
                  <Button
                    key={campus.value}
                    onClick={() => toggleFilter(campus.value, selectedCampuses, setSelectedCampuses)}
                    variant={selectedCampuses.includes(campus.value) ? "default" : "outline"}
                    size="sm"
                    className={selectedCampuses.includes(campus.value) ? "bg-blue-600" : ""}
                  >
                    {selectedCampuses.includes(campus.value) && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {campus.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Learning Time Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Learning Day</label>
                {selectedDays.length > 0 && (
                  <Button
                    onClick={() => setSelectedDays([])}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={toggleAllDays}
                  variant={selectedDays.length === dayOptions.length ? "default" : "outline"}
                  size="sm"
                  className={selectedDays.length === dayOptions.length ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {selectedDays.length === dayOptions.length && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  All Days
                </Button>
                {dayOptions.map((day) => (
                  <Button
                    key={day}
                    onClick={() => toggleFilter(day, selectedDays, setSelectedDays)}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    className={selectedDays.includes(day) ? "bg-blue-600" : ""}
                  >
                    {selectedDays.includes(day) && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
              
              {selectedDays.length > 0 && (
                <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">Time Slots</label>
                    {selectedTimeSlots.length > 0 && (
                      <Button
                        onClick={() => setSelectedTimeSlots([])}
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {timeSlotOptions.map((slot) => (
                      <Button
                        key={slot.value}
                        onClick={() => toggleFilter(slot.value, selectedTimeSlots, setSelectedTimeSlots)}
                        variant={selectedTimeSlots.includes(slot.value) ? "default" : "outline"}
                        size="sm"
                        className={selectedTimeSlots.includes(slot.value) ? "bg-blue-600" : ""}
                      >
                        {selectedTimeSlots.includes(slot.value) && (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        )}
                        {slot.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Method Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Teaching Method</label>
                {selectedMethods.length > 0 && (
                  <Button
                    onClick={() => setSelectedMethods([])}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={toggleAllMethods}
                  variant={selectedMethods.length === methodOptions.length ? "default" : "outline"}
                  size="sm"
                  className={selectedMethods.length === methodOptions.length ? "bg-purple-600 hover:bg-purple-700 text-white" : "hover:bg-gray-100"}
                >
                  {selectedMethods.length === methodOptions.length && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  All Methods
                </Button>
                {methodOptions.map((method) => (
                  <Button
                    key={method.value}
                    onClick={() => toggleFilter(method.value, selectedMethods, setSelectedMethods)}
                    variant={selectedMethods.includes(method.value) ? "default" : "outline"}
                    size="sm"
                    className={selectedMethods.includes(method.value) ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-100"}
                  >
                    {selectedMethods.includes(method.value) ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <method.icon className="w-3 h-3 mr-1" />
                    )}
                    {method.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
                {selectedRatings.length > 0 && (
                  <Button
                    onClick={() => setSelectedRatings([])}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((rating) => (
                  <Button
                    key={rating}
                    onClick={() => toggleRatingFilter(rating)}
                    variant={selectedRatings.includes(rating) ? "default" : "outline"}
                    size="sm"
                    className={selectedRatings.includes(rating) ? "bg-blue-500" : ""}
                  >
                    {selectedRatings.includes(rating) && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Active Filters ({activeFilterCount})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCampuses.map((campus) => (
                    <Badge key={campus} variant="secondary" className="gap-1 pr-1">
                      <span>{campusOptions.find(c => c.value === campus)?.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter(campus, selectedCampuses, setSelectedCampuses);
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  ))}
                  {selectedDays.map((day) => (
                    <Badge key={day} variant="secondary" className="gap-1 pr-1">
                      <span>{day}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter(day, selectedDays, setSelectedDays);
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  ))}
                  {selectedTimeSlots.map((slot) => (
                    <Badge key={slot} variant="secondary" className="gap-1 pr-1">
                      <span>{timeSlotOptions.find(s => s.value === slot)?.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter(slot, selectedTimeSlots, setSelectedTimeSlots);
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  ))}
                  {selectedMethods.map((method) => (
                    <Badge key={method} variant="secondary" className="gap-1 pr-1">
                      <span>{methodOptions.find(m => m.value === method)?.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter(method, selectedMethods, setSelectedMethods);
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  ))}
                  {selectedRatings.map((rating) => (
                    <Badge key={rating} variant="secondary" className="gap-1 pr-1">
                      <span>{rating}+ Stars</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRatingFilter(rating);
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  ))}
                  {selectedSubject !== 'all' && (
                    <Badge variant="secondary" className="gap-1 pr-1">
                      <span>{selectedSubject}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubject('all');
                        }}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{displayTutors.length}</span> tutor{displayTutors.length !== 1 ? 's' : ''}
          {useAIRecommendations && (
            <span className="ml-2 text-purple-600 font-medium">
              (AI Recommended)
            </span>
          )}
        </p>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayTutors.map((tutor) => (
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

      {displayTutors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No tutors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            {activeFilterCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="mt-4"
              >
                Clear All Filters
              </Button>
            )}
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
