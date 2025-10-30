import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  User,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockSubjects, mockTutors } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

export function RegisterTutoring() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [registrationMode, setRegistrationMode] = useState<'manual' | 'auto' | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);

  const subjects = mockSubjects.filter(s => s.score && s.score < 7.0);
  const tutors = mockTutors;

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAutoMatch = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    // Simulate auto-matching
    toast.success('Auto-matching in progress...', {
      description: 'Finding the best tutors for your selected subjects'
    });

    setTimeout(() => {
      toast.success('Successfully matched!', {
        description: `You've been matched with tutors for ${selectedSubjects.length} subject(s)`
      });
      setSelectedSubjects([]);
      setRegistrationMode(null);
    }, 2000);
  };

  const handleManualRegister = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    if (!selectedTutor) {
      toast.error('Please select a tutor');
      return;
    }

    toast.success('Registration successful!', {
      description: 'Your tutor will contact you soon'
    });
    setSelectedSubjects([]);
    setSelectedTutor(null);
    setRegistrationMode(null);
  };

  const getAvailableTutorsForSubjects = () => {
    const subjectCodes = selectedSubjects.map(id => 
      subjects.find(s => s.id === id)?.code
    ).filter(Boolean);
    
    return tutors.filter(tutor => 
      tutor.isAcceptingStudents && 
      tutor.subjects.some(s => subjectCodes.includes(s))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Register for Tutoring</h1>
        <p className="text-gray-600">
          Select subjects you need help with and choose your registration method
        </p>
      </div>

      {/* Registration Mode Selection */}
      {!registrationMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
            onClick={() => setRegistrationMode('auto')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Auto-Match</h3>
              <p className="text-gray-600 mb-4">
                Let our AI system automatically match you with the best tutors based on your needs and their availability
              </p>
              <Badge className="bg-purple-100 text-purple-700">Recommended</Badge>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
            onClick={() => setRegistrationMode('manual')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Choose Tutor</h3>
              <p className="text-gray-600 mb-4">
                Browse available tutors and select the one that best fits your schedule and preferences
              </p>
              <Badge variant="outline">More Control</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject Selection */}
      {registrationMode && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Select Subjects (Score &lt; 7.0)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subjects.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Great Job!</h3>
                  <p className="text-gray-600">All your subjects have scores above 7.0</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSubjects.includes(subject.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{subject.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{subject.code}</p>
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                            Score: {subject.score?.toFixed(1)} / 10.0
                          </Badge>
                        </div>
                        {selectedSubjects.includes(subject.id) && (
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Tutor Selection */}
          {registrationMode === 'manual' && selectedSubjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Available Tutors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAvailableTutorsForSubjects().map((tutor) => (
                    <div
                      key={tutor.id}
                      onClick={() => setSelectedTutor(tutor.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTutor === tutor.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-gray-900">{tutor.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{tutor.staffId}</p>
                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map(s => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {tutor.availability.length} time slots available
                          </div>
                        </div>
                        {selectedTutor === tutor.id && (
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  {getAvailableTutorsForSubjects().length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No tutors available for selected subjects
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setRegistrationMode(null);
                setSelectedSubjects([]);
                setSelectedTutor(null);
              }}
            >
              Back
            </Button>
            {registrationMode === 'auto' ? (
              <Button
                onClick={handleAutoMatch}
                disabled={selectedSubjects.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Auto-Match Me ({selectedSubjects.length} subjects)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleManualRegister}
                disabled={selectedSubjects.length === 0 || !selectedTutor}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Register ({selectedSubjects.length} subjects)
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
