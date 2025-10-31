import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ConsentDialog } from './components/ConsentDialog';
import { Navigation } from './components/Navigation';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TutorsList } from './components/student/TutorsList';
import { RegisterTutoring } from './components/student/RegisterTutoring';
import { MySessions } from './components/student/MySessions';
import { StudentProfile } from './components/student/StudentProfile';
import { TutorDashboard } from './components/tutor/TutorDashboard';
import { TutorSchedule } from './components/tutor/TutorSchedule';
import { TutorStudents } from './components/tutor/TutorStudents';
import { TutorSessions } from './components/tutor/TutorSessions';
import { TutorProfile } from './components/tutor/TutorProfile';
import { Messages } from './components/Messages';
import { mockStudentUser, mockTutorUser } from './data/mockData';
import { User } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const handleLogin = (role: 'student' | 'tutor') => {
    const user = role === 'student' ? mockStudentUser : mockTutorUser;
    setCurrentUser(user);
    
    // Check if first login for students
    if (role === 'student') {
      const hasLoggedInBefore = localStorage.getItem(`user_${user.id}_consent`);
      if (!hasLoggedInBefore) {
        setIsFirstLogin(true);
        setShowConsentDialog(true);
      } else {
        setHasConsent(hasLoggedInBefore === 'true');
      }
    }
  };

  const handleConsent = (agreed: boolean) => {
    setHasConsent(agreed);
    setShowConsentDialog(false);
    
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.id}_consent`, agreed.toString());
    }

    if (agreed) {
      toast.success('Thank you!', {
        description: 'Your data access permission has been granted'
      });
    } else {
      toast.info('Limited Access', {
        description: 'Some features will be unavailable'
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHasConsent(false);
    setCurrentPage('dashboard');
    setIsFirstLogin(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleRegisterTutor = (tutorId: string, subjectId: string) => {
    toast.success('Registration successful!', {
      description: 'Your tutor will contact you soon'
    });
    setCurrentPage('sessions');
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const isStudent = currentUser.role === 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Consent Dialog for Students */}
      {isStudent && showConsentDialog && (
        <ConsentDialog open={showConsentDialog} onConsent={handleConsent} />
      )}

      {/* Main Content */}
      <main>
        {isStudent ? (
          <>
            {currentPage === 'dashboard' && (
              <StudentDashboard hasConsent={hasConsent} onNavigate={handleNavigate} />
            )}
            {currentPage === 'tutors' && (
              <TutorsList onRegister={handleRegisterTutor} />
            )}
            {currentPage === 'register' && <RegisterTutoring />}
            {currentPage === 'sessions' && <MySessions />}
            {currentPage === 'messages' && <Messages userRole="student" />}
            {currentPage === 'profile' && <StudentProfile />}
          </>
        ) : (
          <>
            {currentPage === 'dashboard' && (
              <TutorDashboard onNavigate={handleNavigate} />
            )}
            {currentPage === 'schedule' && <TutorSchedule />}
            {currentPage === 'students' && <TutorStudents />}
            {currentPage === 'sessions' && <TutorSessions />}
            {currentPage === 'messages' && <Messages userRole="tutor" />}
            {currentPage === 'profile' && <TutorProfile />}
          </>
        )}
      </main>

      <Toaster />
    </div>
  );
}
