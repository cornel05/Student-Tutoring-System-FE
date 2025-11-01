import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (role: "student" | "tutor") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showDemoMode, setShowDemoMode] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = () => {
    if (!showLoginForm) {
      setShowLoginForm(true);
      return;
    }

    // Validate form
    if (!username || !password) {
      toast.error("Missing credentials", {
        description: "Please enter both username and password"
      });
      return;
    }

    // Start SSO validation
    setIsLoading(true);
    toast.loading("Connecting to HCMUT_SSO...", { id: "sso-validation" });

    setTimeout(() => {
      toast.loading("Validating credentials...", { id: "sso-validation" });

      setTimeout(() => {
        toast.loading("Verifying role...", { id: "sso-validation" });

        setTimeout(() => {
          // Simulate role detection based on username pattern
          let detectedRole: "student" | "tutor" = "student";
          
          if (username.toLowerCase().includes("tutor") || 
              username.toLowerCase().includes("teacher") ||
              username.toLowerCase().includes("lecturer")) {
            detectedRole = "tutor";
          }

          toast.success("Authentication successful!", { 
            id: "sso-validation",
            description: `Welcome! Logging in as ${detectedRole}...`
          });

          setTimeout(() => {
            setIsLoading(false);
            onLogin(detectedRole);
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleDemoLogin = (role: "student" | "tutor") => {
    toast.success(`Demo login as ${role}`, {
      description: "Using demo credentials"
    });
    onLogin(role);
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

            {/* Login Button */}
            <div className="space-y-4">
              {!showLoginForm ? (
                <Button
                  onClick={handleSSOLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Login with HCMUT SSO
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your HCMUT username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="py-6"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="py-6"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading) {
                          handleSSOLogin();
                        }
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleSSOLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Login with HCMUT SSO
                      </>
                    )}
                  </Button>

                  {!isLoading && (
                    <Button
                      onClick={() => {
                        setShowLoginForm(false);
                        setUsername("");
                        setPassword("");
                      }}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}

              {/* Demo Role Selection */}
              {showDemoMode && !showLoginForm && (
                <div className="pt-4 border-t border-blue-100">
                  <p className="text-center text-sm text-gray-500 mb-3">
                    Demo Mode - Select Role:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDemoLogin("student")}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Student
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin("tutor")}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Tutor
                    </Button>
                  </div>
                </div>
              )}
            </div>

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
