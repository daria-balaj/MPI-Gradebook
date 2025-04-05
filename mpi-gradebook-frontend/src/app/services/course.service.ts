import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient) { }
  apiUrl: string = 'http://localhost:8080/api';

  getCourse(id: number) {
    return this.httpClient.get<Course>(`${this.apiUrl}/courses/${id}`)
  }

  getCoursesForTeacher(teacherId: number) {
    return this.httpClient.get<Course[]>(`${this.apiUrl}/courses/teacher/${teacherId}`)
  }

  getStudentsInCourse(courseId: number) { 
    return this.httpClient.get<User[]>(`${this.apiUrl}/course-participants/course/${courseId}/students`)
  }

  getStudentCountForCourse(courseId: number) {
    return this.httpClient.get<number>(`${this.apiUrl}/courses/${courseId}/students/count`)
  }

  addStudentToCourse(courseId: number, studentId: number) {
    const params = new HttpParams().set('studentId', studentId).set('courseId', courseId);
    return this.httpClient.post(`${this.apiUrl}/course-participants/add`,  params );
  }

  removeStudentFromCourse(courseId: number, studentId: number) {
    return this.httpClient.delete(`${this.apiUrl}/course-participants/remove/${studentId}/${courseId}`);
  }

  createCourse(course: Course) {
    return this.httpClient.post<Course>(`${this.apiUrl}/courses`, course)
  }

  updateCourse(course: Course) {
    return this.httpClient.put<Course>(`${this.apiUrl}/courses/${course.id}`, course)
  }

  deleteCourse(courseId: number) {
    return this.httpClient.delete(`${this.apiUrl}/courses/${courseId}`);
  }
}
