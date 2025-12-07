const API_BASE_URL = '/api';

export interface Enrollment {
  id: string;
  studentId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semester: string;
  grade?: string | null;
  enrollmentStatus: string;
}

class EnrollmentService {
  /**
   * Lấy danh sách môn mà student đã enroll
   * GET /api/students/{studentId}/enrollments?semester=xxx
   */
  async getStudentEnrollments(studentId: string, semester?: string): Promise<Enrollment[]> {
    let url = `${API_BASE_URL}/students/${studentId}/enrollments`;

    if (semester) {
      url += `?semester=${semester}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch enrollments: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lấy chi tiết 1 enrollment
   * GET /api/enrollments/{id}
   */
  async getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
    const response = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch enrollment: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Tạo enrollment mới
   * POST /api/students/{studentId}/enrollments
   */
  async createEnrollment(studentId: string, subjectCode: string, semester: string, subjectId: string): Promise<Enrollment> {
    const url = `${API_BASE_URL}/students/${studentId}/enrollments?subjectCode=${subjectCode}&semester=${semester}&subjectId=${subjectId}`;

    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to create enrollment: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update status
   * PUT /api/enrollments/{id}/status?status=COMPLETED
   */
  async updateEnrollmentStatus(enrollmentId: string, status: string): Promise<Enrollment> {
    const response = await fetch(
      `${API_BASE_URL}/enrollments/${enrollmentId}/status?status=${status}`,
      { method: 'PUT' }
    );

    if (!response.ok) {
      throw new Error(`Failed to update enrollment status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update grade (A, B+, C...)
   * PUT /api/enrollments/{id}/grade?grade=A
   */
  async updateEnrollmentGrade(enrollmentId: string, grade: string): Promise<Enrollment> {
    const response = await fetch(
      `${API_BASE_URL}/enrollments/${enrollmentId}/grade?grade=${grade}`,
      { method: 'PUT' }
    );

    if (!response.ok) {
      throw new Error(`Failed to update enrollment grade: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Xoá enrollment
   * DELETE /api/enrollments/{id}
   */
  async deleteEnrollment(enrollmentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete enrollment: ${response.statusText}`);
    }
  }
}

export const enrollmentService = new EnrollmentService();
