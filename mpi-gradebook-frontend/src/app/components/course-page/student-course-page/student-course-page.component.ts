import { Component, OnInit } from '@angular/core';
import { Course } from '../../../models/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { Grade } from '../../../models/grade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-course-page',
  standalone: false,
  templateUrl: './student-course-page.component.html',
  styleUrl: './student-course-page.component.scss'
})
export class StudentCoursePageComponent implements OnInit {
  courseId: number = 0;
  studentId: number | null = null;

  course: Course | null = null;
  average: number | null = null;
  grades: Grade[] = [];
  loading = true;
  error = false;

  dataSource = this.grades;
  displayedColumns: string[] = ['grade', 'updatedAt'];


  constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    if (!this.courseId) return;

    this.authService.getCurrentUser().pipe(
      filter(user => !!user), // Only proceed if user exists
      switchMap(user => {
        this.studentId = user!.id;
        return this.courseService.getCourse(this.courseId); // Return an observable
      })
    ).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;

        this.courseService.getAverageGradeForStudentAndCourse(this.studentId!, this.courseId).subscribe({
          next: (average) => {
            this.average = average;
          }
        });

        this.courseService.getGradesForStudentAndCourse(this.studentId!, this.courseId).subscribe({
          next: (grades) => { 
            this.grades = grades;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;

        this.courseService.getAverageGradeForStudentAndCourse(this.studentId!, this.courseId).subscribe({
          next: (average) => {
            this.average = average;
            console.log(this.average)
          }
        });

        this.courseService.getGradesForStudentAndCourse(this.studentId!, this.courseId).subscribe({
          next: (grades) => { 
            this.grades = grades;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.loading = false;
        this.showError('Failed to load course details');
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
