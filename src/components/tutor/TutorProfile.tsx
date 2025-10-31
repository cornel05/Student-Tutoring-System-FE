import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  IdCard,
  Edit,
  Save,
  Award,
  Upload,
  FileText,
  X,
  Plus
} from 'lucide-react';
import { mockTutorUser } from '../../data/mockData';
import { toast } from 'sonner';
import { TutorCredential } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function TutorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockTutorUser);
  const [subjects, setSubjects] = useState(['MT2013', 'MT1003', 'MT1005', 'PH1003']);
  const [bio, setBio] = useState('Experienced mathematics tutor with 10+ years of teaching experience. Specializing in calculus, linear algebra, and statistics.');
  const [credentials, setCredentials] = useState<TutorCredential[]>([
    { id: 'c1', name: 'PhD Certificate - Mathematics', fileUrl: '#', uploadDate: '2023-01-15' },
    { id: 'c2', name: 'Teaching License', fileUrl: '#', uploadDate: '2023-02-20' }
  ]);
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newCredentialName, setNewCredentialName] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const availableSubjects = ['MT1003', 'MT1005', 'MT2013', 'PH1003', 'PH1007', 'CH1003', 'CO1007', 'CO2003'];

  const handleSave = () => {
    toast.success('Profile updated successfully', {
      description: 'Your changes have been saved'
    });
    setIsEditing(false);
  };

  const handleUploadCredential = () => {
    if (!newCredentialName.trim()) {
      toast.error('Please enter a credential name');
      return;
    }
    
    const newCredential: TutorCredential = {
      id: `c${credentials.length + 1}`,
      name: newCredentialName,
      fileUrl: '#',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setCredentials([...credentials, newCredential]);
    toast.success('Credential uploaded successfully');
    setShowAddCredential(false);
    setNewCredentialName('');
  };

  const handleRemoveCredential = (id: string) => {
    setCredentials(credentials.filter(c => c.id !== id));
    toast.success('Credential removed');
  };

  const handleAddSubject = () => {
    if (!newSubject) {
      toast.error('Please select a subject');
      return;
    }
    
    if (subjects.includes(newSubject)) {
      toast.error('Subject already added');
      return;
    }
    
    setSubjects([...subjects, newSubject]);
    toast.success('Subject added successfully');
    setShowAddSubject(false);
    setNewSubject('');
  };

  const handleRemoveSubject = (subject: string) => {
    if (subjects.length === 1) {
      toast.error('You must have at least one subject');
      return;
    }
    setSubjects(subjects.filter(s => s !== subject));
    toast.success('Subject removed');
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
            Bio & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Professional Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              placeholder="Describe your teaching experience and expertise..."
              className="mt-2 min-h-24"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Teaching Subjects</Label>
              {isEditing && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAddSubject(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subject
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Badge 
                  key={subject} 
                  variant="outline" 
                  className="text-sm px-3 py-1.5 flex items-center gap-2"
                >
                  {subject}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSubject(subject)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Credentials & Certifications
            </CardTitle>
            {isEditing && (
              <Button 
                size="sm"
                onClick={() => setShowAddCredential(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Credential
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length > 0 ? (
            <div className="space-y-3">
              {credentials.map((credential) => (
                <div 
                  key={credential.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">{credential.name}</p>
                      <p className="text-sm text-gray-500">Uploaded: {credential.uploadDate}</p>
                    </div>
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCredential(credential.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No credentials uploaded yet
            </p>
          )}
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
      
      {/* Add Credential Dialog */}
      <Dialog open={showAddCredential} onOpenChange={setShowAddCredential}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Credential</DialogTitle>
            <DialogDescription>
              Add a new credential or certification to your profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Credential Name</Label>
              <Input
                value={newCredentialName}
                onChange={(e) => setNewCredentialName(e.target.value)}
                placeholder="e.g., PhD Certificate, Teaching License"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Upload File</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCredential(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadCredential} className="bg-blue-600 hover:bg-blue-700">
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={showAddSubject} onOpenChange={setShowAddSubject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Teaching Subject</DialogTitle>
            <DialogDescription>
              Select a subject you want to teach
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Subject Code</Label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
              >
                <option value="">Select a subject</option>
                {availableSubjects
                  .filter(s => !subjects.includes(s))
                  .map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))
                }
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubject(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubject} className="bg-blue-600 hover:bg-blue-700">
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
