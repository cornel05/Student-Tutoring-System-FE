export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "ads" | "oaa" | "osa";
  studentId?: string;
  staffId?: string;
}

export function getCurrentUser(): CurrentUser | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse current user:', error);
    return null;
  }
}

export function setCurrentUser(user: CurrentUser): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem('currentUser');
}
