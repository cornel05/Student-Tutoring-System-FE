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
  CheckCircle2
} from 'lucide-react';
import { mockTutors, mockSubjects } from '../../data/mockData';
import { Tutor } from '../../types';

interface TutorsListProps {
  onRegister: (tutorId: string, subjectId: string) => void;
}

export function TutorsList({ onRegister }: TutorsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
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

              {/* Register Button */}
              <div className="pt-4 border-t">
                {tutor.isAcceptingStudents ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Select subject to register:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subjectCode) => (
                        <Button
                          key={subjectCode}
                          size="sm"
                          onClick={() => onRegister(tutor.id, subjectCode)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Register for {subjectCode}
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
    </div>
  );
}
