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

export const mockADSUser: User = {
  id: 'ads1',
  name: 'Dr. Pham Van Khanh',
  email: 'khanh.pham@hcmut.edu.vn',
  role: 'ads',
  staffId: 'AD2020001',
  phone: '+84 903 456 789',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ads1'
};

export const mockOAAUser: User = {
  id: 'oaa1',
  name: 'Prof. Le Thi Mai',
  email: 'mai.le@hcmut.edu.vn',
  role: 'oaa',
  staffId: 'OAA2019001',
  phone: '+84 904 567 890',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oaa1'
};

export const mockOSAUser: User = {
  id: 'osa1',
  name: 'Ms. Nguyen Thi Lan',
  email: 'lan.nguyen@hcmut.edu.vn',
  role: 'osa',
  staffId: 'OSA2021001',
  phone: '+84 905 678 901',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=osa1'
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
  // Completed sessions for testing feedback functionality
  {
    id: 'ts2',
    studentId: 'student1',
    tutorId: 't2',
    subjectId: 's3',
    status: 'completed',
    startDate: '2024-06-01',
    studentName: 'Nguyen Van An',
    tutorName: 'Dr. Pham Thi Dung',
    subjectName: 'General Physics 1',
    meetings: [
      {
        id: 'm4',
        date: '2024-06-05',
        time: '15:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/987654321',
        attended: true,
        notes: 'Mechanics fundamentals'
      },
      {
        id: 'm5',
        date: '2024-06-12',
        time: '15:00',
        duration: 90,
        type: 'offline',
        attended: true,
        notes: 'Newton\'s laws and applications'
      },
      {
        id: 'm6',
        date: '2024-06-19',
        time: '15:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/987654321',
        attended: true,
        notes: 'Energy and momentum'
      },
      {
        id: 'm7',
        date: '2024-06-26',
        time: '15:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/987654321',
        attended: true,
        notes: 'Rotational motion'
      },
      {
        id: 'm8',
        date: '2024-07-03',
        time: '15:00',
        duration: 90,
        type: 'offline',
        attended: true,
        notes: 'Final review and exam preparation'
      }
    ]
  },
  {
    id: 'ts3',
    studentId: 'student1',
    tutorId: 't3',
    subjectId: 's8',
    status: 'completed',
    startDate: '2024-03-10',
    studentName: 'Nguyen Van An',
    tutorName: 'MSc. Hoang Van Em',
    subjectName: 'Computer Architecture',
    meetings: [
      {
        id: 'm9',
        date: '2024-03-15',
        time: '16:00',
        duration: 60,
        type: 'online',
        zoomLink: 'https://zoom.us/j/555666777',
        attended: true,
        notes: 'Introduction to CPU architecture'
      },
      {
        id: 'm10',
        date: '2024-03-22',
        time: '16:00',
        duration: 60,
        type: 'online',
        zoomLink: 'https://zoom.us/j/555666777',
        attended: true,
        notes: 'Memory hierarchy and cache'
      },
      {
        id: 'm11',
        date: '2024-03-29',
        time: '16:00',
        duration: 60,
        type: 'offline',
        attended: false,
        notes: 'Student was absent'
      },
      {
        id: 'm12',
        date: '2024-04-05',
        time: '16:00',
        duration: 60,
        type: 'online',
        zoomLink: 'https://zoom.us/j/555666777',
        attended: true,
        notes: 'Pipelining and instruction-level parallelism'
      },
      {
        id: 'm13',
        date: '2024-04-12',
        time: '16:00',
        duration: 60,
        type: 'online',
        zoomLink: 'https://zoom.us/j/555666777',
        attended: true,
        notes: 'I/O systems and storage'
      },
      {
        id: 'm14',
        date: '2024-04-19',
        time: '16:00',
        duration: 60,
        type: 'offline',
        attended: true,
        notes: 'Final exam preparation'
      }
    ]
  },
  {
    id: 'ts4',
    studentId: 'student1',
    tutorId: 't1',
    subjectId: 's12',
    status: 'completed',
    startDate: '2024-04-20',
    studentName: 'Nguyen Van An',
    tutorName: 'Dr. Le Van Cuong',
    subjectName: 'Computer Networks',
    meetings: [
      {
        id: 'm15',
        date: '2024-04-25',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/111222333',
        attended: true,
        notes: 'OSI model and network layers'
      },
      {
        id: 'm16',
        date: '2024-05-02',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/111222333',
        attended: true,
        notes: 'TCP/IP protocol suite'
      },
      {
        id: 'm17',
        date: '2024-05-09',
        time: '14:00',
        duration: 90,
        type: 'offline',
        attended: true,
        notes: 'Routing algorithms and protocols'
      },
      {
        id: 'm18',
        date: '2024-05-16',
        time: '14:00',
        duration: 90,
        type: 'online',
        zoomLink: 'https://zoom.us/j/111222333',
        attended: true,
        notes: 'Network security basics'
      }
    ]
  }
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

// Analytics Data for ADS
export const mockAnalyticsData = {
  kpis: {
    totalStudents: 1847,
    activeSessions: 342,
    avgGradeImprovement: 1.2,
    successRate: 87,
    studentsSeekingHelp: 823,
    improvedAfterTutoring: 687,
    avgSessionsPerStudent: 5.8
  },
  courses: [
    { code: 'MT2013', name: 'Probability and Statistics', enrolled: 245, withTutoring: 112, passRate: 84, avgScore: 7.2 },
    { code: 'CO3021', name: 'Computer Networks', enrolled: 198, withTutoring: 89, passRate: 79, avgScore: 6.8 },
    { code: 'CO3005', name: 'Operating Systems', enrolled: 187, withTutoring: 76, passRate: 81, avgScore: 7.1 },
    { code: 'CO2004', name: 'Computer Architecture', enrolled: 203, withTutoring: 54, passRate: 75, avgScore: 6.5 },
    { code: 'PH1003', name: 'Physics 1', enrolled: 312, withTutoring: 98, passRate: 72, avgScore: 6.3 },
    { code: 'MT1003', name: 'Calculus 1', enrolled: 402, withTutoring: 145, passRate: 68, avgScore: 6.1 },
  ]
};

// OAA Reports Data
export const mockOAAReports = {
  utilization: {
    rate: 45,
    trend: '+8%',
    totalParticipants: 823,
    studentPercentage: 44.6,
    activeTutors: 28,
    departments: 6,
    sessionsCompleted: 1247,
    avgHoursPerStudent: 8.7
  },
  satisfaction: {
    score: 4.6,
    responses: 687,
    breakdown: [
      { category: 'Tutor Quality', score: 4.7 },
      { category: 'Scheduling', score: 4.3 },
      { category: 'Learning Impact', score: 4.8 }
    ]
  },
  outcomes: {
    improvement: 15.3,
    passRateIncrease: 12,
    gradePointIncrease: 1.2,
    retentionRate: 94,
    successStories: 187
  },
  budget: {
    current: '450M VND',
    recommended: '520M VND',
    expectedGrowth: 25
  }
};

// OSA Reports Data
export const mockOSAReports = {
  participation: {
    total: 851,
    asTutees: 823,
    asTutors: 28,
    byYear: [
      { year: 1, count: 128, percentage: 15 },
      { year: 2, count: 298, percentage: 35 },
      { year: 3, count: 230, percentage: 27 },
      { year: 4, count: 195, percentage: 23 }
    ]
  },
  credits: {
    awarded: 2847,
    recipients: 623,
    avgPerStudent: 4.6,
    tiers: [
      { name: 'Bronze', credits: '2-3', students: 264, percentage: 42 },
      { name: 'Silver', credits: '4-5', students: 201, percentage: 32 },
      { name: 'Gold', credits: '6-7', students: 112, percentage: 18 },
      { name: 'Platinum', credits: '8+', students: 46, percentage: 8 }
    ]
  },
  scholarships: {
    eligible: 158,
    recommended: 46,
    topPerformers: [
      { id: '1', name: 'Tran Van Duc', studentId: '2021045', year: 3, credits: 8, rating: 4.9, sessions: 24 },
      { id: '2', name: 'Le Thi Hong', studentId: '2022089', year: 2, credits: 7, rating: 4.8, sessions: 21 },
      { id: '3', name: 'Pham Van Minh', studentId: '2021112', year: 3, credits: 7, rating: 4.7, sessions: 19 },
      { id: '4', name: 'Nguyen Thi Nga', studentId: '2022156', year: 2, credits: 6, rating: 4.8, sessions: 18 },
      { id: '5', name: 'Hoang Van Phong', studentId: '2021203', year: 3, credits: 6, rating: 4.6, sessions: 17 }
    ]
  },
  evaluation: {
    avgScore: 4.6,
    responseCount: 687,
    categories: [
      { name: 'Teaching Quality', score: 4.7 },
      { name: 'Communication', score: 4.6 },
      { name: 'Scheduling Flexibility', score: 4.3 },
      { name: 'Learning Materials', score: 4.5 },
      { name: 'Overall Satisfaction', score: 4.8 }
    ]
  }
};
