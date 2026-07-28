/**
 * Academy Routes Configuration
 * ============================
 * 
 * Contains routes for academy management, courses, and training programs.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const AcademyDashboard = React.lazy(() => import('../features/academy/pages/AcademyDashboard'));
const CourseList = React.lazy(() => import('../features/academy/pages/CourseList'));
const StudentList = React.lazy(() => import('../features/academy/pages/StudentList'));
const CoachList = React.lazy(() => import('../features/academy/pages/CoachList'));

// ─── ACADEMY ROUTES (AcademyLayout) ─────────────────────────────────────────────
export const academyRoutes: RouteObject[] = [
  {
    path: '/academy',
    element: <AcademyDashboard />,
  },
];

// ─── ACADEMY COURSE ROUTES ──────────────────────────────────────────────────────
export const academyCourseRoutes: RouteObject[] = [
  {
    path: '/academy/courses',
    element: <CourseList />,
  },
];

// ─── ACADEMY STUDENT ROUTES ─────────────────────────────────────────────────────
export const academyStudentRoutes: RouteObject[] = [
  {
    path: '/academy/students',
    element: <StudentList />,
  },
];

// ─── ACADEMY COACH ROUTES ───────────────────────────────────────────────────────
export const academyCoachRoutes: RouteObject[] = [
  {
    path: '/academy/coaches',
    element: <CoachList />,
  },
];