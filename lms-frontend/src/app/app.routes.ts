import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './shared/auth.guard';
import { TutorGuard } from './shared/tutor/tutor.guard';
import { StudentGuard } from './shared/student/student.guard';

export const routes: Routes = [
  // Public
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Authenticated shell
  {
    path: '',
    component: LayoutComponent,
    children: [

      // Student-only routes
      {
        path: 'courses',
        canActivate: [AuthGuard, StudentGuard],
        loadComponent: () => import('./courses/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'courses/:id',
        canActivate: [AuthGuard, StudentGuard],
        loadComponent: () => import('./courses/course-details/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'my-courses',
        canActivate: [AuthGuard, StudentGuard],
        loadComponent: () => import('./courses/my-course/my-courses.component').then(m => m.MyCoursesComponent)
      },

      // Tutor-only routes
      {
        path: 'tutor-dashboard',
        canActivate: [AuthGuard, TutorGuard],
        loadComponent: () => import('./dashboard/tutor/tutor-dashboard.component').then(m => m.TutorDashboardComponent)
      },
      {
        path: 'create-course',
        canActivate: [AuthGuard, TutorGuard],
        loadComponent: () => import('./courses/create-course/create-course.component').then(m => m.CreateCourseComponent)
      },
      {
        path: 'tutor-dashboard/course/:id',
        canActivate: [AuthGuard, TutorGuard],
        loadComponent: () => import('./courses/manage-course/manage-course.component').then(m => m.ManageCourseComponent)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'welcome' }
];
