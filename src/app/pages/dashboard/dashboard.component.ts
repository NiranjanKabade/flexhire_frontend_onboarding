import {
  Component,
  inject,
  Injector,
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
  // @ViewChild(CompanyInfoComponent) companyInfoComponent!: CompanyInfoComponent;
  // @ViewChild(ContactInfoComponent) contactInfoComponent!: ContactInfoComponent;
  // @ViewChild(CompanyDocumentationComponent) companyDocumentationComponent!: CompanyDocumentationComponent;

  steps: any= [
    {
      title: 'Company Information',
      component: CompanyInfoComponent,
    },
    {
      title: 'Contact Information',
      component: ContactInfoComponent,
    },
    {
      title: 'Company Documents',
      component: CompanyDocumentationComponent,
    },
    { title: 'Done', content: 'Completed' },
  ];

  activeStep = 0;
  formData: any = {};
  warningMessage: string | null = null;

  constructor(private formDataService: FormDataService) {}

  ngOnInit(): void {
    this.formDataService.formData$.subscribe((data) => {
      this.formData = data;
    });
  }
  get componentInjector() {
    return Injector.create({
      providers: [
        {
          provide: CompanyInfoComponent,
          useValue: {
            next: () => this.onNextStep(),
          },
        },
        {
          provide: ContactInfoComponent,
          useValue: {
            next: () => this.onNextStep(),
          },
        },
        {
          provide: CompanyDocumentationComponent,
          useValue: {
            next: () => this.onNextStep(),
          },
        },
      ],
    });
  }

  onNextStep() {
    const currentStepComponent = this.getCurrentStepComponent();
    if (currentStepComponent) {
      // const formData = currentStepComponent.getFormData();
      // this.formDataService.updateFormData(formData);
    }
    if (this.activeStep < this.steps.length - 1) {
      this.activeStep++;
    }
  }

 // Method to handle the previous step
 goToPreviousStep() {
  if (this.activeStep > 0) {
    this.activeStep--;
  }
}

  goToStep(index: number) {
    this.activeStep = index;
  }

  private getCurrentStepComponent() {
    switch (this.activeStep) {
      case 0: return CompanyInfoComponent;
      case 1: return ContactInfoComponent;
      case 2: return CompanyDocumentationComponent;
      default: return null;
    }
  }
}