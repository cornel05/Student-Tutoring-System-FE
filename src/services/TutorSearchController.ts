const API_BASE_URL = '/api';

export interface TutorSearchResult {
  tutorId: string;
  tutorName: string;
  email?: string;
  campus?: string;
  rating?: number;
  ratingCount?: number;
  expertiseAreas?: string[];

  courses?: string[];               
  availability: AvailabilityDto[];
}

export interface AvailabilityDto {
  day: string;
  startTime: string;
  endTime: string;
}

export interface TutorProfile {
  tutorId: string;
  tutorName: string;
  email?: string;
  campus?: string;
  rating?: number;
  ratingCount?: number;
  expertiseAreas?: string[];
  availableSlots: AvailabilityDto[];
}

class TutorService {
  /**
   * Search tutors by various filters
   * GET /api/tutors/search?course=xxx&name=xxx&campus=xxx&mode=xxx&minRating=xxx&useAi=xxx
   */
  async searchTutors(
    course?: string,
    name?: string,
    campus?: string,
    mode?: string,
    minRating?: number,
    useAi: boolean = false
  ): Promise<TutorSearchResult[]> {
    const params = new URLSearchParams();
    if (course) params.append('course', course);
    if (name) params.append('name', name);
    if (campus) params.append('campus', campus);
    if (mode) params.append('mode', mode);
    if (minRating !== undefined) params.append('minRating', minRating.toString());
    params.append('useAi', useAi.toString());

    const response = await fetch(`${API_BASE_URL}/tutors/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tutors: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Recommend tutors for a student
   * GET /api/tutors/recommend?studentId=xxx&subjectId=xxx
   */
  async recommendTutors(studentId: string, subjectId?: string): Promise<TutorSearchResult[]> {
    const params = new URLSearchParams();
    params.append('studentId', studentId);
    if (subjectId) params.append('subjectId', subjectId);

    const response = await fetch(`${API_BASE_URL}/tutors/recommend?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recommended tutors: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get full profile of a tutor by tutorId
   * GET /api/tutors/{tutorId}
   */
  async getTutorProfile(tutorId: string): Promise<TutorProfile> {
    const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tutor profile: ${response.statusText}`);
    }

    return response.json();
  }
}

export const tutorService = new TutorService();
