export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'ads' | 'oaa' | 'osa';
  studentId?: string;
  staffId?: string;
  major?: string;
  year?: number;
  phone?: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  score?: number;
  semester?: string;
  year?: number;
}

export interface Tutor {
  id: string;
  name: string;
  staffId: string;
  email: string;
  subjects: string[];
  availability: TimeSlot[];
  maxStudents: number;
  currentStudents: number;
  isAcceptingStudents: boolean;
  avatar?: string;
  rating?: number;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  mode?: 'online' | 'offline' | 'both';
  location?: string;
  zoomLink?: string;
  capacity?: number;
  isPublished?: boolean;
  requiresApproval?: boolean;
}

export interface BlackoutDate {
  id: string;
  date: string;
  reason: string;
}

export interface TutorCredential {
  id: string;
  name: string;
  fileUrl: string;
  uploadDate: string;
}

export interface TutoringSession {
  id: string;
  studentId: string;
  tutorId: string;
  subjectId: string;
  status: 'active' | 'cancelled' | 'completed';
  startDate: string;
  meetings: Meeting[];
  studentName?: string;
  tutorName?: string;
  subjectName?: string;
}

export interface Meeting {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: 'online' | 'offline';
  zoomLink?: string;
  attended: boolean;
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface CancellationRequest {
  sessionId: string;
  reason: string;
  details: string;
  timestamp: string;
}
