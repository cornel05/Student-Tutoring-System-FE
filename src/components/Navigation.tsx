import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  UserCircle,
  LogOut,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart3,
  FileText,
  Award
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  currentUser: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navigation({ currentUser, currentPage, onNavigate, onLogout }: NavigationProps) {
  const isStudent = currentUser.role === 'student';
  const isTutor = currentUser.role === 'tutor';
  const isADS = currentUser.role === 'ads';
  const isOAA = currentUser.role === 'oaa';
  const isOSA = currentUser.role === 'osa';

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tutors', label: 'Find Tutors', icon: Users },
    { id: 'register', label: 'Register', icon: ClipboardList },
    { id: 'sessions', label: 'My Sessions', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const tutorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'sessions', label: 'My Sessions', icon: ClipboardList },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const adsNavItems = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
  ];

  const oaaNavItems = [
    { id: 'dashboard', label: 'Overview Reports', icon: FileText },
  ];

  const osaNavItems = [
    { id: 'dashboard', label: 'Student Affairs', icon: Award },
  ];

  let navItems = studentNavItems;
  if (isTutor) navItems = tutorNavItems;
  if (isADS) navItems = adsNavItems;
  if (isOAA) navItems = oaaNavItems;
  if (isOSA) navItems = osaNavItems;

  const getRoleLabel = () => {
    if (isStudent) return currentUser.studentId;
    if (isADS) return 'Academic Dept';
    if (isOAA) return 'Academic Affairs';
    if (isOSA) return 'Student Affairs';
    return currentUser.staffId;
  };

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">HCMUT</h2>
              <p className="text-xs text-gray-600">Peer Tutoring</p>
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-600">
                {getRoleLabel()}
              </p>
            </div>
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>
                <UserCircle className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 overflow-x-auto">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`whitespace-nowrap ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
