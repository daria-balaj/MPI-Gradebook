import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RequestResetComponent } from './components/request-reset/request-reset.component';
import { VerifyResetComponent } from './components/verify-reset/verify-reset.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { TeacherDashboardComponent } from './components/teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentGuard } from './guards/student.guard';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { CoursePageComponent } from './components/course-page/course-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { 
    path: 'teacher',
    // canActivate: [TeacherGuard],
    children: [
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'courses/:id', component: CoursePageComponent },
    ]
  },
  {
    path: 'student',
    // canActivate: [StudentGuard],
    children: [
      { path: 'profile', component: StudentDashboardComponent },
    ]
  },
  { path: 'request-reset', component: RequestResetComponent },
  { path: 'verify-reset', component: VerifyResetComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
