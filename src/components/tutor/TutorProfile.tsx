import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  IdCard,
  Edit,
  Save,
  Award
} from 'lucide-react';
import { mockTutorUser } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

export function TutorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockTutorUser);
  const [subjects, setSubjects] = useState(['MT2013', 'MT1003', 'MT1005', 'PH1003']);

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">View and manage your tutor profile</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <IdCard className="w-4 h-4" />
                Staff ID
              </Label>
              <Input
                value={profile.staffId}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutoring Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Tutoring Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {subjects.map((subject) => (
              <Badge key={subject} variant="outline" className="text-sm px-3 py-1">
                {subject}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            These are the subjects you're available to tutor. Contact administration to update your subject list.
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Performance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-3xl text-blue-600 mb-1">12</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-3xl text-green-600 mb-1">48</p>
              <p className="text-sm text-gray-600">Sessions Completed</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-3xl text-purple-600 mb-1">4.8</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-3xl text-orange-600 mb-1">92%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* University Information */}
      <Card>
        <CardHeader>
          <CardTitle>University Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Institution</p>
              <p className="text-gray-900">HCMUT</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Department</p>
              <p className="text-gray-900">Mathematics</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Position</p>
              <p className="text-gray-900">Associate Professor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
