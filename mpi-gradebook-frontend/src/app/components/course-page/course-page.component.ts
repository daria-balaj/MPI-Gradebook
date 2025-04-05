import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, map, startWith } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-page',
  standalone: false,
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.scss'
})
export class CoursePageComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  searchControl = new FormControl('');
  students: User[] = [];
  results: Observable<User[]> = new Observable<User[]>();
  
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private courseService: CourseService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['id'];
    this.loadCourse(courseId);
    if (!courseId) return;
    
    this.results = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): User[] {
    return this.userService.students.value.filter(student => student.lastName.toLowerCase().includes(value.toLowerCase()))
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;

        this.courseService.getStudentsInCourse(courseId).subscribe(
          students => {
            this.course!.students = students;
          }
        );
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.loading = false;
        this.showError('Failed to load course details');
      }
    });
  }

  addStudent(student: User): void {
    if (!this.course) return;

    this.courseService.addStudentToCourse(this.course.id, student.id).subscribe({
      next: () => {
        this.course?.students.push(student);
        this.searchControl.setValue('');
        this.showSuccess('Student added successfully');
      },
      error: (error) => {
        console.error('Error adding student:', error);
        this.showError('Failed to add student');
      }
    });
  }

  confirmRemoveStudent(student: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Remove student',
        message: `Are you sure you want to remove ${student.lastName} ${student.firstName} from ${this.course!.courseName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeStudent(student.id);
      }
    });
  }
    

  removeStudent(studentId: number): void {
    if (!this.course) return;

    this.courseService.removeStudentFromCourse(this.course.id, studentId).subscribe({
      next: () => {
        if (this.course) {
          this.course.students = this.course.students.filter(s => s.id !== studentId);
        }
        this.showSuccess('Student removed successfully');
      },
      error: (error) => {
        console.error('Error removing student:', error);
        this.showError('Failed to remove student');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
