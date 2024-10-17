import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  otpForm: FormGroup;
  message: string | undefined;

constructor(private fb: FormBuilder, private route: Router) {
  this.otpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}

onSubmit() {
  if (this.otpForm.valid) {
    const email = this.otpForm.value.email;
    // this.passwordService.requestOTP(email).subscribe({
    //   next: (response) => {
    //     this.message = response.message; // Handle the success response
    //     this.route.navigate(['/reset-password'], { queryParams: { email: email } });

    //   },
    //   error: (err) => {
    //     this.message = err.error.error || 'An error occurred'; // Handle the error response
    //   }
    // });
    this.route.navigate(["/reset-password"]);
  }
}
}
