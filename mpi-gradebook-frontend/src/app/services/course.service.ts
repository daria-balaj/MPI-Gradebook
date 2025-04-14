import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';
import { Grade } from '../models/grade';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private httpClient: HttpClient) {}
  apiUrl: string = 'http://localhost:8080/api';

  getCourse(id: number) {
    return this.httpClient.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  getCoursesForTeacher(teacherId: number) : Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.apiUrl}/courses/teacher/${teacherId}`).pipe(
      map((courses: Course[]) => {
        return courses.map((course: Course) => {
          return {
            id: course.id,
            courseName: course.courseName,
            description: course.description,
            students: course.students || [],
            studentCount: course.studentCount || 0
          };
        });
      }
    ));
  }

  getCoursesForStudent(studentId: number) {
    return this.httpClient.get<Course[]>(`${this.apiUrl}/course-participants/student/${studentId}/courses`)
  }

  getStudentsInCourse(courseId: number) {
    return this.httpClient.get<User[]>(
      `${this.apiUrl}/course-participants/course/${courseId}/students`
    );
  }

  getStudentCountForCourse(courseId: number) {
    return this.httpClient.get<number>(`${this.apiUrl}/course-participants/course/${courseId}/count`)
  }

  addStudentToCourse(courseId: number, studentId: number) {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('courseId', courseId);
    return this.httpClient.post(
      `${this.apiUrl}/course-participants/add`,
      params
    );
  }

  removeStudentFromCourse(courseId: number, studentId: number) {
    return this.httpClient.delete(
      `${this.apiUrl}/course-participants/remove/${studentId}/${courseId}`
    );
  }

  createCourse(course: Course) {
    return this.httpClient.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(course: Course) {
    return this.httpClient.put<Course>(
      `${this.apiUrl}/courses/${course.id}`,
      course
    );
  }

  deleteCourse(courseId: number) {
    return this.httpClient.delete(`${this.apiUrl}/courses/${courseId}`);
  }

  addGrade(courseId: number, studentId: number, grade: number) {
    return this.httpClient.post(`${this.apiUrl}/grades`, {
      value: grade,
      student: {
        id: studentId,
      },
      course: {
        id: courseId,
      },
    });
  }

  updateGrade(gradeId: number, grade: number) {
    const params = new HttpParams().set('newValue', grade);
    return this.httpClient.put(`${this.apiUrl}/grades/${gradeId}`, params);
  }

  deleteGrade(gradeId: number) {
    return this.httpClient.delete(`${this.apiUrl}/grades/${gradeId}`);
  }

  getGradesForStudent(studentId: number): Observable<Grade[]> {
    return this.httpClient.get<Grade[]>(`${this.apiUrl}/grades/detail/${studentId}`)
  }
  

  uploadGradesCsv(courseId: number, formData: FormData) {
    return this.httpClient.post(
      `${this.apiUrl}/grades/bulk-upload/${courseId}`,
      formData
    );
  }

  getGradesForStudentAndCourse(studentId: number, courseId: number): Observable<Grade[]> {
    const params = new HttpParams().set('studentId', studentId).set('courseId', courseId);
    return this.httpClient.get<Grade[]>(`${this.apiUrl}/grades/course`, { params });
  }

  getAverageGradeForStudentAndCourse(studentId: number, courseId: number): Observable<number> {
    const params = new HttpParams().set('studentId', studentId).set('courseId', courseId);
    return this.httpClient.get<number>(`${this.apiUrl}/grades/average`, { params });
  }

  getAverageGradeForStudent(studentId: number) {
    return this.httpClient.get<number>(`${this.apiUrl}/grades/average/${studentId}`);
  }



}
