import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  IdCard,
  Edit,
  Save,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { mockStudentUser } from "../../data/mockData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockStudentUser);
  const [showDeclarationDialog, setShowDeclarationDialog] = useState(false);
  const [declarationSubmitted, setDeclarationSubmitted] = useState(false);

  // Declaration form state
  const [declaration, setDeclaration] = useState({
    major: "Computer Science",
    minor: "",
    additionalCourses: [] as string[],
    supportNeeds: {
      scholarship: false,
      academicHelp: false,
      advising: false,
      mentalHealth: false,
      careerGuidance: false,
    },
    scholarshipDetails: "",
    academicHelpDetails: "",
    advisingDetails: "",
    additionalNotes: "",
  });

  const availableMinors = [
    "None",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Software Engineering",
    "Information Systems",
  ];

  const availableCourses = [
    "Advanced Machine Learning",
    "Cloud Computing",
    "Mobile App Development",
    "Blockchain Technology",
    "Computer Vision",
    "Natural Language Processing",
  ];

  const handleSave = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleDeclarationSubmit = () => {
    toast.loading("Validating with HCMUT_DATACORE...", { id: "validation" });

    setTimeout(() => {
      toast.success("Data validated successfully", { id: "validation" });

      toast.loading("Saving enrollment record...", { id: "saving" });

      setTimeout(() => {
        toast.success("Enrollment and support needs saved", { id: "saving" });

        setDeclarationSubmitted(true);
        setShowDeclarationDialog(false);

        toast.success("Declaration submitted successfully!", {
          description:
            "Your academic advisor and faculty office have been notified.",
        });

        console.log("Notifications sent to:", {
          academicAdvisor: true,
          facultyOffice: true,
          declarationData: declaration,
        });
      }, 1500);
    }, 2000);
  };

  const toggleCourse = (course: string) => {
    setDeclaration(prev => ({
      ...prev,
      additionalCourses: prev.additionalCourses.includes(course)
        ? prev.additionalCourses.filter(c => c !== course)
        : [...prev.additionalCourses, course],
    }));
  };

  const getActiveSupportNeeds = () => {
    return Object.entries(declaration.supportNeeds)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        const labels: Record<string, string> = {
          scholarship: "Scholarship Assistance",
          academicHelp: "Academic Help",
          advising: "Academic Advising",
          mentalHealth: "Mental Health & Wellness",
          careerGuidance: "Career Guidance & Internship",
        };
        return labels[key];
      });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">
            View and manage your personal information
          </p>
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
                onChange={e => setProfile({ ...profile, name: e.target.value })}
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
              <Input value={profile.email} disabled className="bg-gray-50" />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                value={profile.phone}
                onChange={e =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                Major
              </Label>
              <Input value={profile.major} disabled className="bg-gray-50" />
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
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
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

      {/* Enrollment & Support Needs Declaration */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Enrollment & Support Needs Declaration
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {declarationSubmitted
                ? "Your current enrollment and support needs for this semester"
                : "Declare your academic program details and support needs for this semester"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {declarationSubmitted ? (
            <div className="space-y-6">
              {/* Academic Program Details */}
              <div>
                <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Your Academic Program
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-blue-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Major</p>
                      <p className="text-sm text-gray-900">
                        {declaration.major}
                      </p>
                    </div>
                    <div className="p-3 bg-white border border-blue-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Minor</p>
                      <p className="text-sm text-gray-900">
                        {declaration.minor || "None"}
                      </p>
                    </div>
                  </div>

                  {declaration.additionalCourses.length > 0 && (
                    <div className="p-3 bg-white border border-blue-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">
                        Additional Courses
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {declaration.additionalCourses.map(course => (
                          <Badge
                            key={course}
                            variant="outline"
                            className="text-xs"
                          >
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Needs */}
              {getActiveSupportNeeds().length > 0 && (
                <div>
                  <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Your Support Needs
                  </h4>
                  <div className="space-y-3">
                    {declaration.supportNeeds.scholarship && (
                      <div className="p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            Scholarship Assistance
                          </p>
                        </div>
                        {declaration.scholarshipDetails && (
                          <p className="text-xs text-gray-600 ml-6">
                            {declaration.scholarshipDetails}
                          </p>
                        )}
                      </div>
                    )}

                    {declaration.supportNeeds.academicHelp && (
                      <div className="p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            Academic Help (Tutoring, Study Groups)
                          </p>
                        </div>
                        {declaration.academicHelpDetails && (
                          <p className="text-xs text-gray-600 ml-6">
                            {declaration.academicHelpDetails}
                          </p>
                        )}
                      </div>
                    )}

                    {declaration.supportNeeds.advising && (
                      <div className="p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            Academic Advising
                          </p>
                        </div>
                        {declaration.advisingDetails && (
                          <p className="text-xs text-gray-600 ml-6">
                            {declaration.advisingDetails}
                          </p>
                        )}
                      </div>
                    )}

                    {declaration.supportNeeds.mentalHealth && (
                      <div className="p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            Mental Health & Wellness Support
                          </p>
                        </div>
                      </div>
                    )}

                    {declaration.supportNeeds.careerGuidance && (
                      <div className="p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            Career Guidance & Internship Support
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {declaration.additionalNotes && (
                <div className="p-3 bg-white border border-blue-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Additional Notes</p>
                  <p className="text-sm text-gray-900">
                    {declaration.additionalNotes}
                  </p>
                </div>
              )}

              {/* Update Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => setShowDeclarationDialog(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Update Declaration
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="text-blue-900 mb-1">Declaration Required</h4>
                    <p className="text-blue-800 text-sm mb-3">
                      Please complete your enrollment declaration and declare
                      any support needs for this semester.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 mb-4">
                      <li>
                        • Declare your major, minor, and additional courses
                      </li>
                      <li>• Request scholarship assistance if needed</li>
                      <li>• Declare academic support needs</li>
                      <li>• Request academic advising</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowDeclarationDialog(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Declare Enrollment & Support Needs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Declaration Dialog */}
      <Dialog
        open={showDeclarationDialog}
        onOpenChange={setShowDeclarationDialog}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Enrollment & Support Needs Declaration
            </DialogTitle>
            <DialogDescription>
              Complete your academic program details and declare any support
              needs for this semester. This information will be validated with
              HCMUT_DATACORE.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Section 1: Academic Program */}
            <div className="space-y-4">
              <h3 className="text-gray-900 border-b pb-2">
                Academic Program Details
              </h3>

              <div>
                <Label>Major *</Label>
                <Input
                  value={declaration.major}
                  disabled
                  className="bg-gray-50 mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your major is set by your enrollment and cannot be changed
                  here
                </p>
              </div>

              <div>
                <Label>Minor (Optional)</Label>
                <select
                  value={declaration.minor}
                  onChange={e =>
                    setDeclaration({ ...declaration, minor: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm mt-2"
                >
                  {availableMinors.map(minor => (
                    <option key={minor} value={minor}>
                      {minor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Additional Courses (Optional)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableCourses.map(course => (
                    <div key={course} className="flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={course}
                          checked={declaration.additionalCourses.includes(
                            course
                          )}
                          onChange={() => toggleCourse(course)}
                          className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                        />
                      </label>
                      <label
                        htmlFor={course}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {course}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Support Needs */}
            <div className="space-y-4">
              <h3 className="text-gray-900 border-b pb-2">
                Support Needs Declaration
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      id="scholarship"
                      checked={declaration.supportNeeds.scholarship}
                      onChange={e =>
                        setDeclaration({
                          ...declaration,
                          supportNeeds: {
                            ...declaration.supportNeeds,
                            scholarship: e.target.checked,
                          },
                        })
                      }
                      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                    />
                  </label>
                  <div className="flex-1">
                    <label
                      htmlFor="scholarship"
                      className="text-sm text-gray-900 cursor-pointer block mb-1"
                    >
                      Scholarship Assistance
                    </label>
                    {declaration.supportNeeds.scholarship && (
                      <Textarea
                        placeholder="Please describe your scholarship needs and financial situation..."
                        value={declaration.scholarshipDetails}
                        onChange={e =>
                          setDeclaration({
                            ...declaration,
                            scholarshipDetails: e.target.value,
                          })
                        }
                        className="mt-2 text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      id="academicHelp"
                      checked={declaration.supportNeeds.academicHelp}
                      onChange={e =>
                        setDeclaration({
                          ...declaration,
                          supportNeeds: {
                            ...declaration.supportNeeds,
                            academicHelp: e.target.checked,
                          },
                        })
                      }
                      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                    />
                  </label>
                  <div className="flex-1">
                    <label
                      htmlFor="academicHelp"
                      className="text-sm text-gray-900 cursor-pointer block mb-1"
                    >
                      Academic Help (Tutoring, Study Groups)
                    </label>
                    {declaration.supportNeeds.academicHelp && (
                      <Textarea
                        placeholder="Which subjects do you need help with?"
                        value={declaration.academicHelpDetails}
                        onChange={e =>
                          setDeclaration({
                            ...declaration,
                            academicHelpDetails: e.target.value,
                          })
                        }
                        className="mt-2 text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      id="advising"
                      checked={declaration.supportNeeds.advising}
                      onChange={e =>
                        setDeclaration({
                          ...declaration,
                          supportNeeds: {
                            ...declaration.supportNeeds,
                            advising: e.target.checked,
                          },
                        })
                      }
                      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                    />
                  </label>
                  <div className="flex-1">
                    <label
                      htmlFor="advising"
                      className="text-sm text-gray-900 cursor-pointer block mb-1"
                    >
                      Academic Advising
                    </label>
                    {declaration.supportNeeds.advising && (
                      <Textarea
                        placeholder="What do you need advice about? (course selection, career planning, etc.)"
                        value={declaration.advisingDetails}
                        onChange={e =>
                          setDeclaration({
                            ...declaration,
                            advisingDetails: e.target.value,
                          })
                        }
                        className="mt-2 text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="mentalHealth"
                      checked={declaration.supportNeeds.mentalHealth}
                      onChange={e =>
                        setDeclaration({
                          ...declaration,
                          supportNeeds: {
                            ...declaration.supportNeeds,
                            mentalHealth: e.target.checked,
                          },
                        })
                      }
                      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                    />
                  </label>
                  <label
                    htmlFor="mentalHealth"
                    className="text-sm text-gray-900 cursor-pointer"
                  >
                    Mental Health & Wellness Support
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="careerGuidance"
                      checked={declaration.supportNeeds.careerGuidance}
                      onChange={e =>
                        setDeclaration({
                          ...declaration,
                          supportNeeds: {
                            ...declaration.supportNeeds,
                            careerGuidance: e.target.checked,
                          },
                        })
                      }
                      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 border-gray-300 rounded cursor-pointer"
                    />
                  </label>
                  <label
                    htmlFor="careerGuidance"
                    className="text-sm text-gray-900 cursor-pointer"
                  >
                    Career Guidance & Internship Support
                  </label>
                </div>
              </div>

              <div>
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional information you'd like to share..."
                  value={declaration.additionalNotes}
                  onChange={e =>
                    setDeclaration({
                      ...declaration,
                      additionalNotes: e.target.value,
                    })
                  }
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your declaration will be validated with
                HCMUT_DATACORE and your academic advisor and faculty office will
                be notified. Support services will reach out to you based on
                your declared needs.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeclarationDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeclarationSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Declaration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
