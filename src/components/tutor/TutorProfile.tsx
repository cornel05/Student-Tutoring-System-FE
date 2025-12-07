import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
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
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { TutorCredential } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { profileService, UserProfile } from "../../services/api";

export function TutorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [credentials, setCredentials] = useState<TutorCredential[]>([]);

  const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  };
  
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const tutorId = "tutor-1";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      console.log("Loading profile for userId:", userId);
      const data = await profileService.getUserProfile(userId);
      console.log("Profile data loaded:", data);
      setProfile(data);
      setBio(data.bio || "");
      
      // Handle expertiseAreas - can be string or array
      if (data.expertiseAreas) {
        if (typeof data.expertiseAreas === 'string') {
          setSubjects(data.expertiseAreas.split(',').map((s: string) => s.trim()));
        } else if (Array.isArray(data.expertiseAreas)) {
          setSubjects(data.expertiseAreas);
        } else {
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
      
      toast.success("Profile loaded successfully");
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        toast.error("Profile not found. Please contact admin to create your profile.");
        // Initialize empty profile for editing
        setProfile({
          id: userId,
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          campus: "",
          address: "",
          gender: "",
          role: "TUTOR",
          bio: "",
          expertiseAreas: "",
        });
        setBio("");
        setSubjects([]);
      } else {
        toast.error("Failed to load profile. Please check backend connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newCredentialName, setNewCredentialName] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const availableSubjects = [
    "MT1003",
    "MT1005",
    "MT2013",
    "PH1003",
    "PH1007",
    "CH1003",
    "CO1007",
    "CO2003",
  ];

  const handleSave = async () => {
    if (!profile) return;

    try {
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        campus: profile.campus,
        address: profile.address,
        gender: profile.gender,
        bio: bio,
        expertiseAreas: subjects, // Send as array, not string
      };

      console.log("Updating profile with userId:", userId);
      console.log("Update data:", updateData);
      await profileService.updateUserProfile(userId, updateData);
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
      });
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleUploadCredential = async (file: File) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const result = await profileService.uploadTutorCredentials(tutorId, file);
      
      const newCredential: TutorCredential = {
        id: `c${credentials.length + 1}`,
        name: file.name,
        fileUrl: "#",
        uploadDate: new Date().toISOString().split("T")[0],
      };

      setCredentials([...credentials, newCredential]);
      toast.success("Credential uploaded successfully");
      setShowAddCredential(false);
      setNewCredentialName("");
    } catch (error) {
      console.error("Failed to upload credential:", error);
      toast.error("Failed to upload credential");
    }
  };

  const handleRemoveCredential = (id: string) => {
    setCredentials(credentials.filter(c => c.id !== id));
    toast.success("Credential removed");
  };

  const handleAddSubject = () => {
    if (!newSubject) {
      toast.error("Please select a subject");
      return;
    }

    if (subjects.includes(newSubject)) {
      toast.error("Subject already added");
      return;
    }

    setSubjects([...subjects, newSubject]);
    toast.success("Subject added successfully");
    setShowAddSubject(false);
    setNewSubject("");
  };

  const handleRemoveSubject = (subject: string) => {
    if (subjects.length === 1) {
      toast.error("You must have at least one subject");
      return;
    }
    setSubjects(subjects.filter(s => s !== subject));
    toast.success("Subject removed");
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

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Loading profile...
          </CardContent>
        </Card>
      ) : !profile ? (
        <Card>
          <CardContent className="p-8 text-center text-red-500">
            Failed to load profile
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`} 
                  alt={`${profile.firstName} ${profile.lastName}`} 
                />
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
                  First Name
                </Label>
                <Input
                  value={profile.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Last Name
                </Label>
                <Input
                  value={profile.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input value={profile.email} disabled className="bg-gray-50" />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  value={profile.phoneNumber || ""}
                  onChange={e =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4" />
                  Campus
                </Label>
                {isEditing ? (
                  <Select
                    value={profile.campus || ""}
                    onValueChange={(value: string) =>
                      setProfile({ ...profile, campus: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      <SelectItem value="Campus 01">Campus 01</SelectItem>
                      <SelectItem value="Campus 02">Campus 02</SelectItem>
                      <SelectItem value="Campus 03">Campus 03</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profile.campus || ""} disabled className="bg-gray-50" />
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <IdCard className="w-4 h-4" />
                  Gender
                </Label>
                {isEditing ? (
                  <Select
                    value={profile.gender || ""}
                    onValueChange={(value: string) =>
                      setProfile({ ...profile, gender: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profile.gender || ""} disabled className="bg-gray-50" />
                )}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <IdCard className="w-4 h-4" />
                Address
              </Label>
              <Input
                value={profile.address || ""}
                onChange={e =>
                  setProfile({ ...profile, address: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Enter address"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isEditing && profile && (
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => {
            setIsEditing(false);
            loadProfile();
          }}>
            Cancel
          </Button>
        </div>
      )}

      {/* Tutoring Information */}
      {profile && (
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
              onChange={e => setBio(e.target.value)}
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
              {subjects.length > 0 ? subjects.map(subject => (
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
              )) : (
                <p className="text-sm text-gray-500">No subjects added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Credentials */}
      {profile && (
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
              {credentials.map(credential => (
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
                      <p className="text-sm text-gray-500">
                        Uploaded: {credential.uploadDate}
                      </p>
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
      )}

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
                onChange={e => setNewCredentialName(e.target.value)}
                placeholder="e.g., PhD Certificate, Teaching License"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Upload File</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewCredentialName(file.name);
                  }
                }}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCredential(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                const file = fileInput?.files?.[0];
                if (file) {
                  handleUploadCredential(file);
                } else {
                  toast.error("Please select a file");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
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
                onChange={e => setNewSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
              >
                <option value="">Select a subject</option>
                {availableSubjects
                  .filter(s => !subjects.includes(s))
                  .map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubject(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSubject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
