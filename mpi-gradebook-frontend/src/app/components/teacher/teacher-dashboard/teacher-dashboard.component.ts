import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseFormComponent } from '../../course-form/course-form.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: false,
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  courses: Course[] = [];
  error: boolean = false;
  loading: boolean = true;
  teacherId: number = 1;
  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTeacherCourses();
    
  }

  loadTeacherCourses(): void {
    this.courseService.getCoursesForTeacher(1).subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log(this.courses[1].students);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/teacher/courses', courseId]);
  }

  openAddCourseDialog(): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '500px',
      data: { teacherId: this.teacherId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeacherCourses();
        this.snackBar.open('Course created successfully!', 'Close', {
          duration: 3000
        });
      }
    });
  }

  openEditCourseDialog(course: Course): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '500px',
      data: { teacherId: this.teacherId, name: course.courseName, description: course.description }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeacherCourses();
        this.snackBar.open('Course updated successfully!', 'Close', {
          duration: 3000
        });
      }
    });
  }

  confirmDeleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete ${course.courseName}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        this.snackBar.open('Failed to delete course. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }


}
