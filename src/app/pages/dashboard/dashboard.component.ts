import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';

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
export class DashboardComponent implements OnInit{
 
  activeIndex: number = 0;
  steps = [
    { label: 'Company Information'},
    { label: 'Contact Information'},
    { label: 'Company Documentation'},
  ];
  formData: any;
  showCompanyInfo: boolean = true;
  showContactInfo: boolean = false;
  showCompanyDocu: boolean = false;

  constructor(private formDataService: FormDataService, private http:HttpClient) {}

  ngOnInit(): void {
     // Subscribe to the BehaviorSubject to get the form data
     this.formDataService.formData$.subscribe((data) => {
      this.formData = data;
    });
  }

 
  onNext() {
    if (this.showCompanyInfo) {
      // Validate and store data if needed
      this.showCompanyInfo = false;
      this.showContactInfo = true;
      this.showCompanyDocu = false;
    }
     else if (this.showContactInfo) {
      // Handle final submission logic here if needed
      this.showCompanyInfo = false;
      this .showCompanyDocu=true;
      this.showContactInfo = false;
      
    } else if(this.showCompanyDocu){
      this.submitData();
    }
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }
    



  submitData() {
    // Submit all collected data to your backend
    const companyInfo = this.formDataService.getFormData('company-info');
    const contactInfo = this.formDataService.getFormData('contactInfo');

    // Make an API call to submit the combined data
    // Replace 'your-api-endpoint' with your actual API endpoint
    // this.http.post('your-api-endpoint/submit', { companyInfo, contactInfo })
    //   .subscribe(response => {
    //     console.log('Data submitted successfully:', response);
    //   }, error => {
    //     console.error('Error submitting data:', error);
    //   });
  }
 
}
