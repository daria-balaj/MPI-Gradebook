import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, map, startWith } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Grade } from '../../models/grade';

@Component({
  selector: 'app-course-page',
  standalone: false,
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.scss'
})
export class CoursePageComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) expansionPanels!: QueryList<MatExpansionPanel>;

  course: Course | null = null;
  loading = true;
  searchControl = new FormControl('');
  students: User[] = [];
  results: Observable<User[]> = new Observable<User[]>();
  selectedStudent: User | null = null;
  selectedGradeId: number | null = null;
  gradeControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(10)
  ]);
  studentGrades: Map<number, Grade[]> = new Map();
  step?: number; 

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

  setAccordionStep(step: number): void {
    this.selectedStudent = this.students[step];
    this.expansionPanels.forEach((panel, index) => {
      if (index === step) {
        panel.open();
      } else {
        panel.close();
      }
    });
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;

        this.courseService.getStudentsInCourse(courseId).subscribe(
          (students: User[]) => {
            this.course!.students = students;
            students.forEach(student => {
              this.courseService.getGradesForStudent(student.id).subscribe(grades => {
                this.studentGrades.set(student.id, grades);
              });
            }
          )
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

  // selectStudent(student: User): void {
  //   this.selectedStudent = student;

  //   // Close other panels
  //   this.expansionPanels.forEach(panel => panel.close());
    
  //   // Load grades if not already loaded
  //   if (!this.studentGrades.has(student.id)) {
  //     this.courseService.getGradesForStudent(student.id).subscribe(grades => {
  //       this.studentGrades.set(student.id, grades);
  //     });
  //   }
  // }

  submitGrade(id: number): void {
    if (!this.course || !this.gradeControl.valid) return;
    const grade = this.gradeControl.value;
    this.courseService.addGrade(this.course.id, id, Number(grade)).subscribe({
      next: () => {
        this.courseService.getGradesForStudent(id).subscribe(grades => {
          this.studentGrades.set(id, grades);
        }
        );
        this.showSuccess(`Grade ${grade} added for ${this.selectedStudent?.lastName}`);
        this.gradeControl.reset();
        // this.selectedStudent = null;
        console.log(this.studentGrades.get(id))
      },
      error: (error) => {
        console.error('Error adding grade:', error);
        this.showError('Failed to add grade');
      }
    });
  }

  confirmDeleteGrade(): void {
    if (!this.selectedGradeId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Grade',
        message: `Are you sure you want to delete this grade?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGrade();
      }
    });
  }

  selectGrade(id: number) {
    this.selectedGradeId = id;
  }

  private deleteGrade(): void {
    if (!this.selectedGradeId) return;

    this.courseService.deleteGrade(this.selectedGradeId).subscribe({
      next: () => {
        this.loadCourse(this.course!.id);
        this.showSuccess('Grade deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting grade:', error);
        this.showError('Failed to delete grade');
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
