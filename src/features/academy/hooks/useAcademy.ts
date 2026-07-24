import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { academyApi, Academy, studentApi, Student, batchApi, Batch, coachApi, Coach, courseApi, Course, progressApi, Progress } from '../services/api';

// Academy hooks
export const useAcademies = (options?: Omit<UseQueryOptions<Academy[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['academies'],
    queryFn: academyApi.getAcademies,
    ...options,
  });
};

export const useAcademyById = (id: string, options?: Omit<UseQueryOptions<Academy, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['academy', id],
    queryFn: () => academyApi.getAcademyById(id),
    ...options,
  });
};

export const useCreateAcademy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academyApi.createAcademy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academies'] });
    },
  });
};

export const useUpdateAcademy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Academy> }) =>
      academyApi.updateAcademy(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['academy', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['academies'] });
    },
  });
};

export const useDeleteAcademy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academyApi.deleteAcademy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academies'] });
    },
  });
};

// Student hooks
export const useStudents = (
  params?: { academyId?: string; batchId?: string },
  options?: Omit<UseQueryOptions<Student[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentApi.getStudents(params),
    ...options,
  });
};

export const useStudentById = (id: string, options?: Omit<UseQueryOptions<Student, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentApi.getStudentById(id),
    ...options,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentApi.updateStudent(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Batch hooks
export const useBatches = (
  params?: { academyId?: string; coachId?: string },
  options?: Omit<UseQueryOptions<Batch[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => batchApi.getBatches(params),
    ...options,
  });
};

export const useBatchById = (id: string, options?: Omit<UseQueryOptions<Batch, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchApi.getBatchById(id),
    ...options,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchApi.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Batch> }) =>
      batchApi.updateBatch(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchApi.deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

// Coach hooks
export const useCoaches = (
  params?: { academyId?: string },
  options?: Omit<UseQueryOptions<Coach[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['coaches', params],
    queryFn: () => coachApi.getCoaches(params),
    ...options,
  });
};

export const useCoachById = (id: string, options?: Omit<UseQueryOptions<Coach, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['coach', id],
    queryFn: () => coachApi.getCoachById(id),
    ...options,
  });
};

export const useCreateCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coachApi.createCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

export const useUpdateCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coach> }) =>
      coachApi.updateCoach(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coach', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

export const useDeleteCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coachApi.deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

// Course hooks
export const useCourses = (
  params?: { academyId?: string },
  options?: Omit<UseQueryOptions<Course[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseApi.getCourses(params),
    ...options,
  });
};

export const useCourseById = (id: string, options?: Omit<UseQueryOptions<Course, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseApi.getCourseById(id),
    ...options,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Progress hooks
export const useProgress = (
  params?: { studentId?: string; courseId?: string; batchId?: string },
  options?: Omit<UseQueryOptions<Progress[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['progress', params],
    queryFn: () => progressApi.getProgress(params),
    ...options,
  });
};

export const useProgressById = (id: string, options?: Omit<UseQueryOptions<Progress, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['progress', id],
    queryFn: () => progressApi.getProgressById(id),
    ...options,
  });
};

export const useCreateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.createProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Progress> }) =>
      progressApi.updateProgress(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

export const useDeleteProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.deleteProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};
