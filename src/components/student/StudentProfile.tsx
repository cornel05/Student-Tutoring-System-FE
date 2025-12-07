import { useState, useEffect } from "react";
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
import { getStudentIdFromLocalStorage } from "../../components/student/StudentDashboard"
import SubjectService from "../../services/SubjectService"
import { Subject } from "../../services/SubjectService";
import { enrollmentService } from "../../services/EnrollmentService"


export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockStudentUser);
  const [showDeclarationDialog, setShowDeclarationDialog] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [declarationSubmitted, setDeclarationSubmitted] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await SubjectService.getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to load subjects", error);
      }
    };

    fetchSubjects();
  }, []);
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


  const handleSave = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const handleCreateEnrollment = async (selectedCourse, selectedCourseId) => {
    try {
      toast.loading("Creating enrollment...", { id: "enroll" });

      const studentId = storedUser.studentId;
      const courseCode = selectedCourse;
      const courseId = selectedCourseId;
      const semester = "252"

      const result = await enrollmentService.createEnrollment(studentId, courseCode, semester, courseId);

      toast.success("Enrollment created successfully!", { id: "enroll" });
      console.log("Enrollment:", result);

    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message || "Failed to create enrollment";

      toast.error(msg, { id: "enroll" });
    }
  };

  const handleDeclarationSubmit = async () => {
    try {
      const studentId = storedUser.studentId;

      toast.loading("Validating with HCMUT_DATACORE...", { id: "validation" });

      await new Promise(r => setTimeout(r, 1500));

      toast.success("Data validated successfully", { id: "validation" });
      const need = buildSupportNeed();

      if (!need) {
        toast.error("No support need selected");
        return;
      }

      const saved = await createSupportNeeds(studentId, need);

      setDeclarationSubmitted(true);
      setShowDeclarationDialog(false);

      toast.success("Declaration submitted successfully!", {
        description:
          "Your academic advisor and faculty office have been notified.",
      });

      console.log("Saved support needs:", saved);

    } catch (err) {
      console.error(err);
      toast.error("Failed to submit declaration");
    }
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

  const buildSupportNeed = () => {
    if (declaration.supportNeeds.scholarship) {
      return {
        supportType: "SCHOLARSHIP",
        description: declaration.scholarshipDetails
      };
    }

    if (declaration.supportNeeds.academicHelp) {
      return {
        supportType: "ACADEMIC_HELP",
        description: declaration.academicHelpDetails
      };
    }

    if (declaration.supportNeeds.advising) {
      return {
        supportType: "ADVISING",
        description: declaration.advisingDetails
      };
    }

    return null;
  };
  async function createSupportNeeds(studentId, needs) {
    const res = await fetch(
      `api/students/${studentId}/support-needs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(needs)
      }
    );

    if (!res.ok) throw new Error("Cannot create support needs");

    return res.json();
  }

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

      {/* Enrollment Section */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Enrollment Declaration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Render tất cả subjects */}
          <div className="space-y-3">
            {subjects.map((subj) => (
              <div
                key={subj.code}
                className="flex items-center gap-3 p-2 bg-white border rounded-lg"
              >
                <input
                  type="radio"
                  name="selectedSubject"
                  className="w-5 h-5"
                  checked={declaration.selectedSubject === subj.code}
                  onChange={() => {
                    setDeclaration({
                      ...declaration,
                      selectedSubject: subj.code,
                      selectedSubjectId: subj.id,
                    });
                  }}
                />

                <span className="text-sm text-gray-900">
                  {subj.name} ({subj.code})
                </span>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() =>
              handleCreateEnrollment(
                declaration.selectedSubject,
                declaration.selectedSubjectId
              )
            }
          >
            Enroll Now
          </Button>
        </CardContent>
      </Card>


      {/* Support Needs Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Support Needs Declaration
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Declare scholarship, academic help, or advising needs.
          </p>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            onClick={() => setShowDeclarationDialog(true)}
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Declare Support Needs
          </Button>
        </CardContent>
      </Card>
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <h4 className="font-semibold">Selected Subjects</h4>
            {declaration.enrolledSubjects?.length > 0 ? (
              <ul className="list-disc ml-6 text-sm">
                {subjects
                  .filter(s => declaration.enrolledSubjects.includes(s.id))
                  .map(s => (
                    <li key={s.id}>{s.name}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No subjects selected.</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Submit Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
