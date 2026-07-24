import { apiService, ApiResponse } from '../../../shared/services/api';

// Academy types
export interface Academy {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  banner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  parentId: string;
  academyId: string;
  batchId: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  name: string;
  academyId: string;
  coachId: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  maxStudents: number;
  currentStudents: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  specialization: string;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  courseId: string;
  batchId: string;
  performance: {
    attendance: number;
    skillLevel: number;
    fitness: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Helper to extract data from response
const extractData = <T>(response: ApiResponse<T> | { error: any }): T => {
  if ('error' in response) {
    throw response.error;
  }
  return response.data;
};

// Academy API
export const academyApi = {
  getAcademies: async () => {
    const response = await apiService.get<Academy[]>('/academies');
    return extractData(response);
  },

  getAcademyById: async (id: string) => {
    const response = await apiService.get<Academy>(`/academies/${id}`);
    return extractData(response);
  },

  createAcademy: async (academy: Omit<Academy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Academy>('/academies', { body: academy });
    return extractData(response);
  },

  updateAcademy: async (id: string, academy: Partial<Academy>) => {
    const response = await apiService.put<Academy>(`/academies/${id}`, { body: academy });
    return extractData(response);
  },

  deleteAcademy: async (id: string) => {
    const response = await apiService.delete(`/academies/${id}`);
    return extractData(response);
  },
};

// Student API
export const studentApi = {
  getStudents: async (params?: { academyId?: string; batchId?: string }) => {
    const response = await apiService.get<Student[]>('/students', { params });
    return extractData(response);
  },

  getStudentById: async (id: string) => {
    const response = await apiService.get<Student>(`/students/${id}`);
    return extractData(response);
  },

  createStudent: async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Student>('/students', { body: student });
    return extractData(response);
  },

  updateStudent: async (id: string, student: Partial<Student>) => {
    const response = await apiService.put<Student>(`/students/${id}`, { body: student });
    return extractData(response);
  },

  deleteStudent: async (id: string) => {
    const response = await apiService.delete(`/students/${id}`);
    return extractData(response);
  },
};

// Batch API
export const batchApi = {
  getBatches: async (params?: { academyId?: string; coachId?: string }) => {
    const response = await apiService.get<Batch[]>('/batches', { params });
    return extractData(response);
  },

  getBatchById: async (id: string) => {
    const response = await apiService.get<Batch>(`/batches/${id}`);
    return extractData(response);
  },

  createBatch: async (batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Batch>('/batches', { body: batch });
    return extractData(response);
  },

  updateBatch: async (id: string, batch: Partial<Batch>) => {
    const response = await apiService.put<Batch>(`/batches/${id}`, { body: batch });
    return extractData(response);
  },

  deleteBatch: async (id: string) => {
    const response = await apiService.delete(`/batches/${id}`);
    return extractData(response);
  },
};

// Coach API
export const coachApi = {
  getCoaches: async (params?: { academyId?: string }) => {
    const response = await apiService.get<Coach[]>('/coaches', { params });
    return extractData(response);
  },

  getCoachById: async (id: string) => {
    const response = await apiService.get<Coach>(`/coaches/${id}`);
    return extractData(response);
  },

  createCoach: async (coach: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Coach>('/coaches', { body: coach });
    return extractData(response);
  },

  updateCoach: async (id: string, coach: Partial<Coach>) => {
    const response = await apiService.put<Coach>(`/coaches/${id}`, { body: coach });
    return extractData(response);
  },

  deleteCoach: async (id: string) => {
    const response = await apiService.delete(`/coaches/${id}`);
    return extractData(response);
  },
};

// Course API
export const courseApi = {
  getCourses: async (params?: { academyId?: string }) => {
    const response = await apiService.get<Course[]>('/courses', { params });
    return extractData(response);
  },

  getCourseById: async (id: string) => {
    const response = await apiService.get<Course>(`/courses/${id}`);
    return extractData(response);
  },

  createCourse: async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Course>('/courses', { body: course });
    return extractData(response);
  },

  updateCourse: async (id: string, course: Partial<Course>) => {
    const response = await apiService.put<Course>(`/courses/${id}`, { body: course });
    return extractData(response);
  },

  deleteCourse: async (id: string) => {
    const response = await apiService.delete(`/courses/${id}`);
    return extractData(response);
  },
};

// Progress API
export const progressApi = {
  getProgress: async (params?: { studentId?: string; courseId?: string; batchId?: string }) => {
    const response = await apiService.get<Progress[]>('/progress', { params });
    return extractData(response);
  },

  getProgressById: async (id: string) => {
    const response = await apiService.get<Progress>(`/progress/${id}`);
    return extractData(response);
  },

  createProgress: async (progress: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Progress>('/progress', { body: progress });
    return extractData(response);
  },

  updateProgress: async (id: string, progress: Partial<Progress>) => {
    const response = await apiService.put<Progress>(`/progress/${id}`, { body: progress });
    return extractData(response);
  },

  deleteProgress: async (id: string) => {
    const response = await apiService.delete(`/progress/${id}`);
    return extractData(response);
  },
};