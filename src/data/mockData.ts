import { User, Subject, Tutor, TutoringSession, Meeting, Message } from '../types';

export const mockStudentUser: User = {
  id: 'student1',
  name: 'Nguyen Van An',
  email: 'an.nguyen@hcmut.edu.vn',
  role: 'student',
  studentId: '2021001',
  major: 'Computer Science',
  year: 3,
  phone: '+84 901 234 567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1'
};

export const mockTutorUser: User = {
  id: 'tutor1',
  name: 'Dr. Tran Thi Binh',
  email: 'binh.tran@hcmut.edu.vn',
  role: 'tutor',
  staffId: 'ST2018001',
  phone: '+84 902 345 678',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor1'
};

export const mockSubjects: Subject[] = [
  { id: 's1', code: 'MT1003', name: 'Calculus 1', credits: 4, score: 8.5, semester: 'Fall', year: 2021 },
  { id: 's2', code: 'MT1005', name: 'Linear Algebra', credits: 4, score: 7.8, semester: 'Fall', year: 2021 },
  { id: 's3', code: 'PH1003', name: 'Physics 1', credits: 4, score: 6.5, semester: 'Fall', year: 2021 },
  { id: 's4', code: 'CH1003', name: 'General Chemistry', credits: 3, score: 6.8, semester: 'Spring', year: 2022 },
  { id: 's5', code: 'CO1007', name: 'Introduction to Programming', credits: 4, score: 9.0, semester: 'Spring', year: 2022 },
  { id: 's6', code: 'MT2013', name: 'Probability and Statistics', credits: 4, score: 6.2, semester: 'Fall', year: 2022 },
  { id: 's7', code: 'CO2003', name: 'Data Structures and Algorithms', credits: 4, score: 8.2, semester: 'Fall', year: 2022 },
  { id: 's8', code: 'CO2004', name: 'Computer Architecture', credits: 4, score: 6.9, semester: 'Spring', year: 2023 },
  { id: 's9', code: 'CO3001', name: 'Software Engineering', credits: 4, score: 7.5, semester: 'Spring', year: 2023 },
  { id: 's10', code: 'CO3005', name: 'Operating Systems', credits: 4, score: 6.7, semester: 'Fall', year: 2023 },
  { id: 's11', code: 'CO3009', name: 'Database Systems', credits: 4, score: 8.8, semester: 'Fall', year: 2023 },
  { id: 's12', code: 'CO3021', name: 'Computer Networks', credits: 4, score: 6.4, semester: 'Spring', year: 2024 },
];

export const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Dr. Le Van Cuong',
    staffId: 'ST2015001',
    email: 'cuong.le@hcmut.edu.vn',
    subjects: ['MT2013', 'MT1003', 'MT1005'],
    availability: [
      { id: 'a1', day: 'Monday', startTime: '14:00', endTime: '16:00' },
      { id: 'a2', day: 'Wednesday', startTime: '14:00', endTime: '16:00' },
      { id: 'a3', day: 'Friday', startTime: '10:00', endTime: '12:00' },
    ],
    maxStudents: 5,
    currentStudents: 3,
    isAcceptingStudents: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor2',
    rating: 4.8
  },
  {
    id: 't2',
    name: 'Dr. Pham Thi Dung',
    staffId: 'ST2016002',
    email: 'dung.pham@hcmut.edu.vn',
    subjects: ['PH1003', 'CH1003'],
    availability: [
      { id: 'a4', day: 'Tuesday', startTime: '15:00', endTime: '17:00' },
      { id: 'a5', day: 'Thursday', startTime: '15:00', endTime: '17:00' },
    ],
    maxStudents: 4,
    currentStudents: 2,
    isAcceptingStudents: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor3',
    rating: 4.9
  },
  {
    id: 't3',
    name: 'MSc. Hoang Van Em',
    staffId: 'ST2018003',
    email: 'em.hoang@hcmut.edu.vn',
    subjects: ['CO2004', 'CO3005'],
    availability: [
      { id: 'a6', day: 'Monday', startTime: '16:00', endTime: '18:00' },
      { id: 'a7', day: 'Thursday', startTime: '13:00', endTime: '15:00' },
    ],
    maxStudents: 6,
    currentStudents: 4,
    isAcceptingStudents: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor4',
    rating: 4.7
  },
  {
    id: 't4',
    name: 'Dr. Nguyen Thi Giang',
    staffId: 'ST2017004',
    email: 'giang.nguyen@hcmut.edu.vn',
    subjects: ['CO3021'],
    availability: [
      { id: 'a8', day: 'Wednesday', startTime: '09:00', endTime: '11:00' },
      { id: 'a9', day: 'Friday', startTime: '14:00', endTime: '16:00' },
    ],
    maxStudents: 5,
    currentStudents: 5,
    isAcceptingStudents: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor5',
    rating: 4.6
  },
];

export const mockTutoringSessions: TutoringSession[] = [
  {
    id: 'ts1',
    studentId: 'student1',
    tutorId: 't1',
    subjectId: 's6',
    status: 'active',
    startDate: '2024-09-15',
    studentName: 'Nguyen Van An',
    tutorName: 'Dr. Le Van Cuong',
    subjectName: 'Probability and Statistics',
    meetings: [
      {
        id: 'm1',
        date: '2024-09-20',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/123456789',
        attended: true,
        notes: 'Covered probability basics'
      },
      {
        id: 'm2',
        date: '2024-09-27',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/123456789',
        attended: true,
        notes: 'Worked on distribution problems'
      },
      {
        id: 'm3',
        date: '2024-10-04',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/123456789',
        attended: false,
      },
    ]
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 't1',
    receiverId: 'student1',
    content: 'Hi An, don\'t forget our session tomorrow at 2 PM!',
    timestamp: '2024-10-03T10:30:00',
    read: true
  },
  {
    id: 'msg2',
    senderId: 'student1',
    receiverId: 't1',
    content: 'Thank you Dr. Cuong! I\'ll be there.',
    timestamp: '2024-10-03T11:00:00',
    read: true
  },
];
