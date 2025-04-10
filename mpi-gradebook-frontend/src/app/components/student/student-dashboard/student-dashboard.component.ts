import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { Course } from '../../../models/course';
import { Grade } from '../../../models/grade';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  courses: Course[] = [];
  grades: Grade[] = [];
  dataSource = this.grades;
  displayedColumns: string[] = ['courseName', 'grade', 'updatedAt'];
  constructor (private courseService: CourseService, private userService: UserService) {}
  
  ngOnInit() {
    //replace with the actual student ID
    this.courseService.getCoursesForStudent(2).subscribe(courses => {
      this.courses = courses;
    });
    
    this.courseService.getGradesForStudent(2).subscribe(grades => {
      this.grades = grades;
    });
  }
}
