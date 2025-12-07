const API_BASE_URL = '/api';

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

class SubjectService {
  async getAllSubjects(): Promise<Subject[]> {
    const response = await fetch(`${API_BASE_URL}/subjects`);

    if (!response.ok) {
      throw new Error(`Failed to fetch subjects: ${response.statusText}`);
    }

    return response.json();
  }

  async getSubjectById(subjectId: string): Promise<Subject> {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch subject: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new SubjectService();
