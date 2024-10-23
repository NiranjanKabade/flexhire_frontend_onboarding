import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';



export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expirationDate = authService.getTokenExpirationDate();

  if (expirationDate) {
    const currentTime = new Date();
    
    // Check if the token will expire in less than 5 minutes
    if (expirationDate.getTime() - currentTime.getTime() < 12 * 60 * 60 * 60 * 1000) {
      console.log('Warning: Token will expire in less than 5 minutes!');
      
      // Store a warning message or flag in localStorage
      localStorage.setItem('tokenWarning', 'Token will expire in less than 5 minutes!');
    }
  }
  
  // Now, check if the user is authenticated
    if (authService.isAuthenticated()) {
        authService.showToast("Login Successful", "success");
        localStorage.setItem('Authenticated', 'true');
        return true;
    } else {
        authService.showToast("Please provide the credentials properly", "error");
        localStorage.setItem('Authenticated', 'false');
        router.navigateByUrl('/login');
        return false;
    }

    
      
}


