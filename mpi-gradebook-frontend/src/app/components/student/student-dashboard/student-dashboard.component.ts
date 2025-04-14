import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { Course } from '../../../models/course';
import { Grade } from '../../../models/grade';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  studentId?: number;
  courses: Course[] = [];
  grades: Grade[] = [];
  average?: number;

  loading: boolean = true;
  error: boolean = false;

  dataSource = this.grades;
  displayedColumns: string[] = ['courseName', 'grade', 'updatedAt'];

  constructor (private courseService: CourseService, private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.authService.getCurrentUser().pipe(
      filter(user => !!user), // Only proceed if user exists
      switchMap(user => {
        this.studentId = user!.id;
        this.loadCourses();
        return this.courseService.getCoursesForStudent(this.studentId);
      })
    ).subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log("courses: ", this.courses, "loading:", this.loading, this.error );
        this.loadGrades();
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadCourses() {
    this.courseService.getCoursesForStudent(this.studentId!).subscribe(courses => {
      this.courses = courses;
      this.loading = false;
    });
  }

  loadGrades() {
    this.courseService.getGradesForStudent(this.studentId!).subscribe(grades => {
      this.grades = grades;
    });
    this.courseService.getAverageGradeForStudent(this.studentId!).subscribe(average => {
      this.average = average;
    });
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/student/courses', courseId]);
  }
}
