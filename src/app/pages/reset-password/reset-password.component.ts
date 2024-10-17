import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  message: string | null=null;
  emailFromPreviousPage: string | null = null;
  messageType: 'success' | 'error' = 'success'; // Type of message

  constructor(private fb: FormBuilder, private router: Router,private route: ActivatedRoute,) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    
    this.emailFromPreviousPage = this.route.snapshot.queryParamMap.get('email');

    // Patch the email value into the form
    if (this.emailFromPreviousPage) {
      this.resetForm.patchValue({
        email: this.emailFromPreviousPage
      });
    }
   }
  
   
  onSubmit() {
    if (this.resetForm.valid) {
      const { email, otp, newPassword } = this.resetForm.value;
      // this.passwordService.resetPassword(email, otp, newPassword).subscribe({
      //   next: (response) => {
      //     this.message = response.message; // Handle the success response
      //   },
      //   error: (err) => {
      //     this.message = err.error.error || 'An error occurred'; // Handle the error response
      //   }
      // });
    }
  }

   // Function to show toast message
   showToast() {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        this.message = null; // Clear message after toast disappears
      }, 3000); // Toast will disappear after 3 seconds
    }
  }
}
