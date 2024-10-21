import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Country, DataService } from '../../services/data.service';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    InputTextModule,
    FloatLabelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss',
})
export class CompanyInfoComponent implements OnInit {
  // @Output() next: EventEmitter<void> = new EventEmitter();
  // @Output() prev: EventEmitter<void> = new EventEmitter();
  @Input() next!: () => void; // Input for the next function
  @Input() previous!: () => void; 

  companyForm: FormGroup;
  countries: Country[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    // private http: HttpClient,
    // private router: Router,
    private messageService: MessageService
  ) {
    this.companyForm = this.fb.group({
      companyName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      businessRegNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8,12}$')],
      ], // Example pattern for business registration number
      taxIdentificationNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{11}$')],
      ], // Example TIN validation
      website: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validates if it's a valid URL format
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      industry: ['', Validators.required],
      size: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
          Validators.max(100000),
        ],
      ],
      country: ['', Validators.required], // Add country control
    });

   
  }

  get f() {
    return this.companyForm.controls as {
      companyName: any;
      businessRegNumber: any;
      taxIdentificationNumber: any;
      website: any;
      description: any;
      industry: any;
      size: any;
    };
  }

  ngOnInit(): void {
     // Load previously saved form data (if any)
     this.patchFormData();

    this.loadCountries();
  }

  patchFormData(): void {
    // Load previously saved form data from the DataService
    const savedData = this.dataService.getData();
    console.log(savedData);
    
    if (savedData) {
      this.companyForm.patchValue({
        companyName: savedData.companyName || '',
        businessRegNumber: savedData.businessRegNumber || '',
        taxIdentificationNumber: savedData.taxIdentificationNumber || '',
        website: savedData.website || '',
        description: savedData.description || '',
        industry: savedData.industry || '',
        size: savedData.size || '',
        country: savedData.country || '', // Patch the country field as well
      });
    }
  }

  loadCountries(): void {
    this.dataService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  getFormData() {
    return this.companyForm.value;
  }
  onNext() {
    if (this.companyForm.valid) {
      // Save data logic, including country ID
      
      this.dataService.setData(this.companyForm.value);
      // Call the injected next function from the DashboardComponent
      this.next(); // Call the injected next function
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
        life: 3000 // Duration in milliseconds
      });
      this.companyForm.markAllAsTouched();
      return
    }
  }

   // Method to handle the previous button click
   onPrevious() {
    if (this.previous) {
      this.previous(); // Call the injected previous function
    }
  }
}
