import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None // Disable encapsulation

})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  identifier: string = '';
  password: string = '';
  hidePassword: boolean = true; // To toggle password visibility

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, this.identifierValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { identifier, password } = this.loginForm.value;
      this.authService.login(identifier, password).subscribe({
        next: response => {
          console.log('Login successful', response);
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error('Login failed', err);
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  navigateTo(){
    console.log('Forget password clicked');
    this.router.navigate(['/forgot-password'])
  }
    // Custom validator for identifier
    identifierValidator(control: AbstractControl) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobilePattern = /^[0-9]{10}$/; // Adjust this regex for mobile format as needed
  
      if (control.value) {
        const isEmail = emailPattern.test(control.value);
        const isMobile = mobilePattern.test(control.value);
        
        if (!isEmail && !isMobile) {
          return { invalidIdentifier: true };
        }
      }
      return null; // Valid identifier
    }
}
