import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseFormComponent } from '../../course-form/course-form.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { catchError, filter, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: false,
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss',
})
export class TeacherDashboardComponent implements OnInit {
  courses: Course[] = [];
  error: boolean = false;
  loading: boolean = true;
  teacherId?: number;
  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.loadTeacherCourses();
    this.authService.getCurrentUser().pipe(
          filter(user => !!user), // Only proceed if user exists
          switchMap(user => {
            this.teacherId = user!.id;
            return this.loadTeacherCourses();
          })
        ).subscribe({
          next: (courses) => {
            this.courses = courses;
            this.courses.forEach(course => {
              this.courseService.getStudentCountForCourse(course.id).subscribe({
                next: (count) => {
                  course.studentCount = count;
                },
                error: (error) => {
                  console.error('Error loading student count:', error);
                }
              });
            })
          },
          error: (error) => {
            console.error('Error loading dashboard:', error);
            this.error = true;
            this.loading = false;
          }
        });
  }

  loadTeacherCourses(): Observable<Course[]> {
    return this.courseService.getCoursesForTeacher(this.teacherId!).pipe(
      filter(courses => !!courses), // Ensure courses are not null or undefined
      switchMap(courses => {
        this.loading = false;
        return [courses];
      }),
      catchError(error => {
        console.error('Error loading courses:', error);
        this.error = true;
        this.loading = false;
        return [];
      })
    );
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/teacher/courses', courseId]);
  }

  openAddCourseDialog(): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '500px',
      data: { teacherId: this.teacherId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeacherCourses();
        this.snackBar.open('Course created successfully!', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openEditCourseDialog(course: Course): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '500px',
      data: {
        teacherId: this.teacherId,
        name: course.courseName,
        description: course.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeacherCourses();
        this.snackBar.open('Course updated successfully!', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  confirmDeleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete ${course.courseName}? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCourse(course.id);
      }
    });
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.loadTeacherCourses();
        this.snackBar.open('Course deleted successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        this.snackBar.open(
          'Failed to delete course. Please try again.',
          'Close',
          {
            duration: 5000,
          }
        );
      },
    });
  }
}
