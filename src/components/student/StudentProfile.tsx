import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  IdCard,
  Edit,
  Save
} from 'lucide-react';
import { mockStudentUser } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockStudentUser);

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">View and manage your personal information</p>
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
                Student ID
              </Label>
              <Input
                value={profile.studentId}
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

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                Major
              </Label>
              <Input
                value={profile.major}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                Year
              </Label>
              <Input
                value={`Year ${profile.year}`}
                disabled
                className="bg-gray-50"
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

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">University</p>
              <p className="text-gray-900">HCMUT</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Faculty</p>
              <p className="text-gray-900">Computer Science & Engineering</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Enrollment Year</p>
              <p className="text-gray-900">2021</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
