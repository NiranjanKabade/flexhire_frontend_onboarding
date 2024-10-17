import { Component, inject, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyInfoComponent } from '../company-info/company-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { CompanyDocumentationComponent } from '../company-documentation/company-documentation.component';
import { FormDataService } from '../../form-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    CompanyInfoComponent,
    ContactInfoComponent,
    CompanyDocumentationComponent,
    ButtonModule,
    StepperModule,
    StepsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
 
  activeIndex: number = 0;
  steps = [
    { label: 'Company Information'},
    { label: 'Contact Information'},
    { label: 'Company Documentation'},
  ];

  constructor(private formDataService: FormDataService) {}


  // saveCurrentFormData(step: string, data: any) {
  //   // Save data to cache (BehaviorSubject) and localStorage
  //   this.formDataService.setFormData(step, data);
  // }

  
  onNext(step: string, data: any) {
    this.formDataService.updateFormData(step as keyof FormData, data);
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }


  onPrevious() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  // submitForm() {
  //   this.formDataService.submitData().subscribe({
  //     next: (response) => {
  //       console.log('Form submitted successfully!', response);
  //     },
  //     error: (err) => {
  //       console.error('Error submitting form', err);
  //     },
  //   });
  // }

  submitForm() {
    // Delegate the submit action to the documentation component or directly handle here
  }
 
}
