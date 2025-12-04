import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { userService } from "../services/api";

interface LoginPageProps {
  onLogin: (role: "student" | "tutor" | "ads" | "oaa" | "osa", userData?: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showDemoMode, setShowDemoMode] = useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Real API login function
  const handleSSOLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch users from API
      const usersPage = await userService.listUsers(0, 100);
      const user = usersPage.content.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError("User not found with this email");
        setIsLoading(false);
        return;
      }

      // Map user role to app role
      let role: "student" | "tutor" | "ads" | "oaa" | "osa" = "student";
      
      switch (user.role) {
        case "STUDENT":
          role = "student";
          break;
        case "TUTOR":
          role = "tutor";
          break;
        case "STAFF":
          role = "ads";
          break;
        case "ADMIN":
          role = "oaa";
          break;
        default:
          role = "student";
      }

      // Convert API user to UI user format
      const uiUser = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: role as "student" | "tutor" | "ads" | "oaa" | "osa",
        studentId: role === "student" ? user.id.substring(0, 8) : undefined,
        staffId: (role === "ads" || role === "oaa" || role === "osa" as "student" | "tutor") ? user.id.substring(0, 8) : undefined,
        avatar: undefined, // Can be added later if needed
      };

      // Store user data in localStorage for other components to use
      localStorage.setItem('currentUser', JSON.stringify(uiUser));
      
      onLogin(role, uiUser);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSSOLogin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Toggle Demo Mode Button - Fixed to top right */}
      <Button
        onClick={() => setShowDemoMode(!showDemoMode)}
        variant="outline"
        className="fixed top-8 right-8 z-50 border-blue-300 text-blue-700 hover:bg-blue-50 shadow-lg"
      >
        {showDemoMode ? "Hide Demo Mode" : "Login with Demo Mode"}
      </Button>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-blue-500 rotate-45"></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 border-4 border-blue-600 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-blue-400"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-blue-100">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-full">
                  <GraduationCap className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>

            {/* University Name */}
            <div className="text-center mb-8">
              <h1 className="text-blue-900 mb-2">
                Ho Chi Minh City University of Technology
              </h1>
              <p className="text-blue-600">HCMUT</p>
              <div className="mt-6">
                <h2 className="text-blue-800 mb-2">Peer Tutoring System</h2>
                <p className="text-gray-600 text-sm">
                  Connect. Learn. Succeed Together.
                </p>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@hcmut.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSSOLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Login with HCMUT SSO
                  </>
                )}
              </Button>
            </div>

            {/* Demo Role Selection */}
            {showDemoMode && (
              <div className="pt-4 border-t border-blue-100">
                <p className="text-center text-sm text-gray-500 mb-3">
                  Demo Mode - Quick Login:
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onLogin("student")}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Student
                    </Button>
                    <Button
                      onClick={() => onLogin("tutor")}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Tutor
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onLogin("ads")}
                      variant="outline"
                      className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                    >
                      ADS
                    </Button>
                    <Button
                      onClick={() => onLogin("oaa")}
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      OAA
                    </Button>
                    <Button
                      onClick={() => onLogin("osa")}
                      variant="outline"
                      className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      OSA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>© {new Date().getFullYear()} HCMUT. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
