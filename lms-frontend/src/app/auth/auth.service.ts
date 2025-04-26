import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private user: any = null;

  constructor(private http: HttpClient,
     private router: Router,
     private toastr: ToastrService
    ) {
    this.loadUserFromToken();
    this.startSessionWatcher();
  }

  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp > now) {
        this.user = { _id: payload.id, role: payload.role };
      } else {
        this.logout();
      }
    }
  }
  
  
  private logoutTimer: any;

startSessionWatcher() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiresAt = payload.exp * 1000; // convert to ms
  const now = Date.now();

  const timeLeft = expiresAt - now;

  if (timeLeft <= 0) {
    this.logout('Session expired. Please log in again.');
  } else {
    this.logoutTimer = setTimeout(() => {
      this.logout('Session expired. Please log in again.');
    }, timeLeft);
  }
}

logout(message = 'You have been logged out.') {
    localStorage.removeItem('token');
    this.user = null;
    clearTimeout(this.logoutTimer);
    this.toastr.info(message, 'Session Ended'); // 🎉 Fancy toast here
    this.router.navigate(['/login']);
  }
  

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        // Store the entire user object, not just the name
        localStorage.setItem('user', JSON.stringify(res.user)); // Save the entire user
        this.user = { _id: res.user._id, name: res.user.name, role: res.user.role }; // Include name
        this.startSessionWatcher();
        
        // Role-based redirect
        const redirect = this.user.role === 'tutor' ? '/tutor-dashboard' : '/courses';
        this.router.navigate([redirect]);
      })
    );
  }
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  getUserName(): string {
    return this.getUser()?.name || ''; // Access the name from the full user object
  }
  
  getUserRole(): string {
    return this.getUser()?.role || ''; // Access role from the full user object
  }
  

  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.user = { _id: res.user._id, role: res.user.role };
        this.startSessionWatcher();
        
        // 🎯 Redirect based on role
        const redirect = this.user.role === 'tutor' ? '/tutor-dashboard' : '/courses';
        this.router.navigate([redirect]);
      })
    );
  }
  

//   logout() {
//     localStorage.removeItem('token');
//     this.user = null;
//     this.router.navigate(['/login']);
//   }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

}
