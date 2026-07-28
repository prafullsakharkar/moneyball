// Academy domain exports
export * from './students';
export * from './coaches';
export * from './progress';

// Rename DaySchedule to avoid conflict with courses.ts
export type { DaySchedule as BatchDaySchedule } from './batches';
export type { DaySchedule as CourseDaySchedule } from './courses';
export { type Batch, type BatchStatus, type BatchType, type BatchScheduleType } from './batches';
export { type Course, type CourseCategory, type CourseFormat, type CourseDuration } from './courses';