import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  students: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    this.getAllStudents().subscribe(students => {
      this.students.next(students);
    });
   }

  getAllStudents(): Observable<User[]> {  
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      map(users => users.filter(user => user.role === 'STUDENT').map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role
      }))),
    );
  }

  searchStudents(searchTerm: string): Observable<User[]> {
    const params = new HttpParams()
      .set('search', searchTerm)

    return this.http.get<User[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(users => users.filter(user => user.role === 'STUDENT').map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role
      }))),
    );
  }

}
