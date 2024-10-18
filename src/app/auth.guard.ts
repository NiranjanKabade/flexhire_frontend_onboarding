import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from 'express';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const expirationDate = authService.getTokenExpirationDate();

  // if (expirationDate) {
  //   const currentTime = new Date();
    
  //   // Check if the token will expire in less than 5 minutes
  //   if (expirationDate.getTime() - currentTime.getTime() < 12 * 60 * 60 * 60 * 1000) {
  //     console.log('Warning: Token will expire in less than 5 minutes!');
      
  //     // Store a warning message or flag in localStorage
  //     localStorage.setItem('tokenWarning', 'Token will expire in less than 5 minutes!');
  //   }
  // }
  
  // Now, check if the user is authenticated
  if (authService.isAuthenticated()) {
    alert("Login Successful");
  
    // Store authentication status in localStorage
    localStorage.setItem('Authenticated', 'true');
  
    return true;
  } else {
    alert("Please provide the credentials properly");
  
    // Store authentication failure status in localStorage
    localStorage.setItem('Authenticated', 'false');
  
    router.navigate('/login');
    return false;
  }
}
