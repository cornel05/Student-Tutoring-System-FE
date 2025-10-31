import { Button } from "./ui/button";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onLogin: (role: "student" | "tutor" | "ads" | "oaa" | "osa") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showDemoMode, setShowDemoMode] = useState(true);

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
              <Button
                onClick={() => onLogin("student")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Login with HCMUT SSO
              </Button>

              {/* Demo Role Selection */}
              {showDemoMode && (
                <div className="pt-4 border-t border-blue-100">
                  <p className="text-center text-sm text-gray-500 mb-3">
                    Demo Mode - Select Role:
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
