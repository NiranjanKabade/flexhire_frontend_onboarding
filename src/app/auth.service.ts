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
  private apiUrl = 'http://127.0.0.1:8000/api/employer_login/'; // Update with your Django login endpoint
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any ) {
    this.isLoggedIn.next(this.hasToken());
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { identifier, password }).pipe(
      tap((response) => {
        if (response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.refreshTokenKey, response.refresh_token);
          this.isLoggedIn.next(true);
          
        }
        else{
          this.isLoggedIn.next(false)
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private storeToken(accessToken: string, refreshToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

}
