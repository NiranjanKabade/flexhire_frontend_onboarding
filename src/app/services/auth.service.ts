import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UploadEvent } from 'primeng/fileupload';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login'; // Update with your Django login endpoint
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';


  constructor(private http: HttpClient, private router: Router ) {}

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { identifier, password }).pipe(
      tap((response) => {
<<<<<<< HEAD:src/app/services/auth.service.ts
        if (response.access) {
          localStorage.setItem(this.tokenKey, response.access);
          localStorage.setItem(this.refreshTokenKey, response.refresh);
          this.isLoggedIn.next(true);
          
        }
        else{
          this.isLoggedIn.next(false)
=======
        if (response.access_token) {
          // Store tokens in localStorage
          console.log('Saving tokens to localStorage');
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.refreshTokenKey, response.refresh_token);
  
          // Update login status
        } else {
          // Handle login failure
          console.log('Login failed: No access token in the response');
>>>>>>> ce46a74a32424240d1d24daf3c132ac9fc24fa8c:src/app/auth.service.ts
        }
      })
    );
  }

  logout() {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem("access_token")
      localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
  
    return null;
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_Token');
  }

  // isTokenExpired(): boolean {
  //   const token = this.getToken();

  //   // Check if the token exists and whether it is expired
  //   if (token) {
  //     return this.jwtHelper.isTokenExpired(token); // Returns true if the token is expired, false otherwise
  //   }

  //   return true; // If no token is found, consider it expired
  // }

  private storeToken(accessToken: string, refreshToken: string): void {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }



