import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Subject } from '../../types';
import { mockSubjects } from '../../data/mockData';

interface StudentDashboardProps {
  hasConsent: boolean;
  onNavigate: (page: string) => void;
}

export function StudentDashboard({ hasConsent, onNavigate }: StudentDashboardProps) {
  const subjects = mockSubjects;
  const needsHelp = subjects.filter(s => s.score && s.score < 7.0);
  const averageScore = subjects.reduce((acc, s) => acc + (s.score || 0), 0) / subjects.length;
  const totalCredits = subjects.reduce((acc, s) => acc + s.credits, 0);

  if (!hasConsent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-yellow-900 mb-2">Limited Access</h3>
            <p className="text-yellow-800 mb-4">
              You have not granted permission to access your academic data. 
              Many features are unavailable.
            </p>
            <p className="text-sm text-yellow-700">
              Please log out and log in again to grant permission.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">GPA</p>
                <p className="text-3xl">{averageScore.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Credits</p>
                <p className="text-3xl">{totalCredits}</p>
              </div>
              <Award className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Needs Support</p>
                <p className="text-3xl">{needsHelp.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Subjects</p>
                <p className="text-3xl">{subjects.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for Low Scores */}
      {needsHelp.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-orange-900 mb-2">Subjects Need Attention</h3>
                <p className="text-orange-800 mb-4">
                  You have {needsHelp.length} subject(s) with scores below 7.0. 
                  We recommend registering for tutoring to improve your performance.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => onNavigate('tutors')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Find Tutors
                  </Button>
                  <Button 
                    onClick={() => onNavigate('register')}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Register for Tutoring
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Score Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Academic Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const needsImprovement = subject.score && subject.score < 7.0;
              return (
                <div 
                  key={subject.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    needsImprovement 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-gray-900">{subject.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {subject.code}
                        </Badge>
                        {needsImprovement && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Needs Support
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {subject.credits} credits • {subject.semester} {subject.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl ${
                        needsImprovement ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {subject.score?.toFixed(1)}
                      </div>
                      <p className="text-xs text-gray-500">/ 10.0</p>
                    </div>
                  </div>
                  <Progress 
                    value={(subject.score || 0) * 10} 
                    className={needsImprovement ? '[&>div]:bg-orange-500' : '[&>div]:bg-green-500'}
                  />
                  {needsImprovement && (
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onNavigate('tutors')}
                        className="bg-orange-600 hover:bg-orange-700 text-xs"
                      >
                        Find Tutor for {subject.code}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('tutors')}>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">Browse Tutors</h3>
            <p className="text-sm text-gray-600">Find expert tutors for your subjects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('sessions')}>
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">My Sessions</h3>
            <p className="text-sm text-gray-600">View and manage your tutoring sessions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('messages')}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Chat with your tutors</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
