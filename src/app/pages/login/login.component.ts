import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  identifier: string = '';
  password: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required], // For email or mobile number
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { identifier, password } = this.loginForm.value;
      this.authService.login(identifier, password).subscribe({
        next: response => {
          console.log('Login successful', response);
          // // Navigate to a different page or do something else
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error('Login failed', err);
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  OnForgetPass(){
    console.log('Forget password clicked');
    this.router.navigate(['/forgot-password'])
  }
}
