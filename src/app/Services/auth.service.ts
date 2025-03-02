import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserMaster } from '../Models/UserMaster';
import { environment } from '../../environments/environment.development';
import { Auth } from '../Models/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSource = new ReplaySubject<UserMaster | null>(1);
  user$ = this.userSource.asObservable();

  private apiUrl = 'http://localhost:5240/api/';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem(environment.userKey);
    if (storedUser) {
      this.userSource.next(JSON.parse(storedUser));
    }
  }

  // postCategory(category: Customer): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = JSON.stringify(category); // Convert object to JSON
  //   return this.http.post(`${this.apiUrl}Customer/get-All`, body, { headers }); // Send data to API
  // }

  // getCategory(): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(this.apiUrl + 'Customer/Create');
  // }

  //First
  // login(model: User) {
  //   return this.http.post(`${this.apiUrl}account/login`,model)
  // }

  refreshUser(jwt: string | null) {
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http
      .get<UserMaster>(`${this.apiUrl}account/refresh-user-token`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((user: UserMaster) => {
          if (user) {
            this.setUser(user);
          }
        })
      );
  }

  login(model: Auth): Observable<void> {
    return this.http
      .post<UserMaster>(`${this.apiUrl}account/login`, model)
      .pipe(
        map((user: UserMaster) => {
          if (user) {
            this.setUser(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigate(['']);
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: UserMaster = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: UserMaster): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
}
