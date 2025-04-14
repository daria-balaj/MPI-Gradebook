import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { TeacherDashboardComponent } from './components/teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { TeacherCoursePageComponent } from './components/course-page/teacher-course-page/teacher-course-page.component';
import { RequestResetComponent } from './components/request-reset/request-reset.component';
import { VerifyResetComponent } from './components/verify-reset/verify-reset.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { StudentCoursePageComponent } from './components/course-page/student-course-page/student-course-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ConfirmDialogComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent,
    CourseFormComponent,
    TeacherCoursePageComponent,
    StudentCoursePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatAutocompleteModule,
    RequestResetComponent,
    VerifyResetComponent,
    ResetPasswordComponent,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}