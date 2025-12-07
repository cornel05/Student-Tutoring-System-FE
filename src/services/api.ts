const API_BASE_URL = '/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'STAFF' | 'ADMIN' | 'EMPTY' | 'OSA'
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'STAFF' | 'ADMIN' | 'EMPTY';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'STUDENT' | 'TUTOR' | 'STAFF' | 'ADMIN' | 'EMPTY';
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}

class UserService {
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return response.json();
  }

  async listUsers(page = 0, size = 20, sort?: string): Promise<PageResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (sort) {
      params.append('sort', sort);
    }
    
    const response = await fetch(`${API_BASE_URL}/users?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    return response.json();
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    
    return response.json();
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
  }
}

export const userService = new UserService();

// Session API
export interface Session {
  sessionId: string;
  tutorId: string;
  studentId: string;
  startTime: string;
  endTime: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  status: 'PENDING' | 'PENDING_TUTOR_APPROVAL' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  locationOrLink?: string;
}

export interface FeedbackStats {
  tutorId: string;
  averageRating: number;
  totalFeedback: number;
}

class SessionService {
  async getSessionsByTutor(tutorId: string): Promise<Session[]> {
    const response = await fetch(`${API_BASE_URL}/sessions/tutor/${tutorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    return response.json();
  }

  async getSessionsByStudent(studentId: string): Promise<Session[]> {
    const response = await fetch(`${API_BASE_URL}/sessions/student/${studentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    return response.json();
  }

  async updateSessionStatus(sessionId: string, status: string): Promise<Session> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/status?status=${status}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Failed to update session: ${response.statusText}`);
    }
    return response.json();
  }
}

class FeedbackService {
  async getTutorFeedbackStats(tutorId: string): Promise<FeedbackStats> {
    const response = await fetch(`${API_BASE_URL}/feedback/tutor/${tutorId}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch feedback stats: ${response.statusText}`);
    }
    return response.json();
  }
}

export const sessionService = new SessionService();
export const feedbackService = new FeedbackService();

// Profile API
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  campus?: string;
  address?: string;
  gender?: string;
  role: string;
  faculty?: string;
  major?: string;
  bio?: string;
  expertiseAreas?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  campus?: string;
  address?: string;
  gender?: string;
  faculty?: string;
  major?: string;
  bio?: string;
  expertiseAreas?: string[]; // Changed from string to array
}

class ProfileService {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    return response.json();
  }

  async updateUserProfile(userId: string, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }
    return response.json();
  }

  async uploadTutorCredentials(tutorId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/profiles/tutor/${tutorId}/credentials`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload credentials: ${response.statusText}`);
    }
    return response.text();
  }
}

export const profileService = new ProfileService();

// Availability API
export interface Availability {
  uuid: string; // UUID from backend for publish/delete operations
  id: string;
  availabilityId: string;
  tutorId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  locationOrLink?: string;
  capacity: number;
  published: boolean;
}

export interface CreateAvailabilityRequest {
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  mode: string;
  locationOrLink?: string;
  capacity: number;
  published: boolean;
}

class AvailabilityService {
  async getTutorAvailabilities(tutorId: string): Promise<Availability[]> {
    const response = await fetch(`${API_BASE_URL}/availabilities/tutor/${tutorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch availabilities: ${response.statusText}`);
    }
    return response.json();
  }

  async createAvailability(data: CreateAvailabilityRequest): Promise<Availability> {
    const response = await fetch(`${API_BASE_URL}/availabilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create availability: ${response.statusText}`);
    }
    return response.json();
  }

  async updateAvailability(id: string, data: Partial<CreateAvailabilityRequest>): Promise<Availability> {
    const response = await fetch(`${API_BASE_URL}/availabilities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteAvailability(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/availabilities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete availability: ${response.statusText}`);
    }
  }

  async publishAvailability(id: string): Promise<Availability> {
    const response = await fetch(`${API_BASE_URL}/availabilities/${id}/publish`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Failed to publish availability: ${response.statusText}`);
    }
    return response.json();
  }
}

export const availabilityService = new AvailabilityService();

// Analytics Service
export interface AnalyticsReport {
  reportId: string;
  reportType: string;
  generatedBy: string;
  generatedAt: string;
  summary: Record<string, any>;
  data: Record<string, any>;
}

class AnalyticsService {
  async getTutorPerformanceReport(generatedBy = 'system'): Promise<AnalyticsReport> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/reports/tutor-performance?generatedBy=${generatedBy}`
    );
    if (!response.ok) {
      throw new Error(`Failed to get tutor performance report: ${response.statusText}`);
    }
    return response.json();
  }

  async getStudentEngagementReport(generatedBy = 'system'): Promise<AnalyticsReport> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/reports/student-engagement?generatedBy=${generatedBy}`
    );
    if (!response.ok) {
      throw new Error(`Failed to get student engagement report: ${response.statusText}`);
    }
    return response.json();
  }

  async getMaterialUsageReport(generatedBy = 'system'): Promise<AnalyticsReport> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/reports/material-usage?generatedBy=${generatedBy}`
    );
    if (!response.ok) {
      throw new Error(`Failed to get material usage report: ${response.statusText}`);
    }
    return response.json();
  }

  async getComprehensiveReport(generatedBy = 'system'): Promise<AnalyticsReport> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/reports/comprehensive?generatedBy=${generatedBy}`
    );
    if (!response.ok) {
      throw new Error(`Failed to get comprehensive report: ${response.statusText}`);
    }
    return response.json();
  }
}

export const analyticsService = new AnalyticsService();
