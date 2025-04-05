import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';


@Component({
  selector: 'app-course-form',
  standalone: false,
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent {
  courseForm: FormGroup;
  submitButtonText: string = 'Create Course';
  creating = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public dialogRef: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teacherId: number, name: string, description: string }
  ) {
    this.courseForm = this.fb.group({
      courseName: [this.data.name ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [this.data.description ?? '', Validators.maxLength(500)]
    });
    if (this.data.name) {
      this.submitButtonText = 'Update Course';
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      return;
    }

    this.creating = true;
    this.errorMessage = null;
    
    const newCourse = {
      ...this.courseForm.value,
      teacher: { id: this.data.teacherId }
    };

    this.courseService.createCourse(newCourse).subscribe({
      next: (result) => {
        this.creating = false;
        this.dialogRef.close(result);
      },
      error: (error) => {
        this.creating = false;
        this.errorMessage = error.error?.message || 'Failed to create course. Please try again.';
        console.error('Error creating course:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
