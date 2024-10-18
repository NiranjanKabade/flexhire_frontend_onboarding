import {
  Component,
  inject,
  OnInit,
  Type,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { FormDataService } from '../../services/form-data.service';


interface Step {
  title: string;
  component: Type<any>;
}
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
    StepsModule,
    
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(CompanyInfoComponent) companyInfoComponent!: CompanyInfoComponent;

  steps: any = [
    {
      title: 'Company Information',
      component: CompanyInfoComponent,
      key: 'companyInfo',
    },
    {
      title: 'Contact Information',
      component: ContactInfoComponent,
      key: 'contactInfo',
    },
    {
      title: 'Comapany Documents',
      component: CompanyDocumentationComponent,
      key: 'companyDoc',
    },
    { title: 'Done', content: 'Completed' },
  ];
  activeStep = 0;
  formData: any = {};
  warningMessage: string | null = null;

  constructor(private formDataService: FormDataService) {}

  ngOnInit(): void {
    // Subscribe to the form data changes
    this.formDataService.formData$.subscribe((data) => {
      this.formData = data;
      console.log(data);
    });
  }

  // Method to handle the form data emitted by the form component
  onFormDataChanged(data: any) {
    this.formDataService.updateFormData(data);
  }

  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  nextStep() {
    if (this.companyInfoComponent) {
      // Update the form data in the service before moving to the next step
      const formData = this.companyInfoComponent.getFormData();
      this.formDataService.updateFormData(formData);
      this.warningMessage = null;

      if (this.activeStep < this.steps.length - 1) {
        this.activeStep++;
      }
    } else {
      this.warningMessage =
        'Please fill out all required fields before proceeding.';
    }
  }

  goToStep(index: number) {
    this.activeStep = index;
  }

  // Method to clear the form data from the service
  clearFormData() {
    this.formDataService.clearFormData();
  }
}
