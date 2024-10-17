import {
  Component,
  inject,
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
import { FormDataService } from '../../form-data.service';
import { HttpClient } from '@angular/common/http';

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

export class DashboardComponent {
  steps: any = [
    { title: 'Company Information', component: CompanyInfoComponent },
    { title: 'Contact Information', component: ContactInfoComponent },
    { title: 'Comapany Documents', component: CompanyDocumentationComponent },
    { title: 'Done', content: 'Completed' },
  ];
  activeStep = 0;

  goToStep(index: number) {
    if (index === this.steps.length - 1) {
      this.activeStep = index;
    } else {
      this.activeStep = index;
    }
  }
  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }
  
  nextStep() {
    if (this.activeStep < this.steps.length - 1) {
      this.activeStep++;
    }
  }
 
  
}
