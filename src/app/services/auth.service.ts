import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UploadEvent } from 'primeng/fileupload';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { JwtHelperService } from "@auth0/angular-jwt";



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Update with your Django login endpoint
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private router: Router,private snackBar: MatSnackBar,private jwtHelper:JwtHelperService) {}

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { identifier, password }).pipe(
      tap((response) => {
        

        if (response.access_token) {
          // Store tokens in localStorage
          console.log('Saving tokens to localStorage');
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.refreshTokenKey, response.refresh_token);
  
          // Update login status
        } else {
          // Handle login failure
          console.log('Login failed: No access token in the response');
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

  isTokenExpired(): boolean {
    const token = this.getToken();

    // Check if the token exists and whether it is expired
    if (token) {
      return this.jwtHelper.isTokenExpired(token); // Returns true if the token is expired, false otherwise
    }

    return true; // If no token is found, consider it expired
  }
  getTokenExpirationDate(): Date | null {
    const token = this.getToken();

    if (token) {
      // Use JwtHelperService to get the token expiration date
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      return expirationDate;
    }
    
    return null; // If no token found, return null
  }

  private storeToken(accessToken: string, refreshToken: string): void {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    showToast(message: string, action: string = 'Close', duration: number = 2500) {
      this.snackBar.open(message, action, {
        duration: duration,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }

  }
