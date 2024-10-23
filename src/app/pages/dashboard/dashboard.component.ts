import { Component, Injector, OnInit, Type } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyInfoComponent } from '../company-info/company-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { CompanyDocumentationComponent } from '../company-documentation/company-documentation.component';
import { DoneComponent } from '../done/done.component';
import { DataService } from '../../services/data.service';

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
    DoneComponent,
    ButtonModule,
    StepperModule,
    StepsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  steps: any = [
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
    { title: 'Done', component: DoneComponent },
  ];

  activeStep = 0;
  formData: any = {};
  collectedData: any = {};

  constructor(private dataServices: DataService) {}

  ngOnInit(): void {
    this.dataServices.formData.subscribe((data) => {
      if (!data?.step2) {
        this.activeStep = 0;
      } else if (data?.step2 && !data?.step3) {
        this.activeStep = 1;
      }
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
      case 0:
        return CompanyInfoComponent;
      case 1:
        return ContactInfoComponent;
      case 2:
        return CompanyDocumentationComponent;
      case 3:
        return DoneComponent;
      default:
        return null;
    }
  }

  // Check if all previous steps are completed
  allStepsCompleted(): boolean {
    return this.activeStep === 3;
  }
}
