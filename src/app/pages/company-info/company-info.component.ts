import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { FormDataService } from '../../form-data.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  ],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss',
})
export class CompanyInfoComponent implements OnInit {

  @Output() next = new EventEmitter<void>();
  
  companyForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private http: HttpClient,
    private router: Router
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
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
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

  ngOnInit(): void {}

  onNext() {
    if (this.companyForm.valid) {
      // Save form data to the service
      this.formDataService.updateFormData('company-info', this.companyForm.value);
      this.next.emit(); // Emit the next event
      console.log("Data saved successfully for Component One");

      
      // Make an API call to save the data of this specific component
      // this.http.post('your-api-endpoint/company-info', this.companyForm.value).subscribe(
      //   response => {
      //     console.log('Data saved successfully for Component One:', response);
          
      //   },
      //   error => {
      //     console.error('Error saving data for Component One:', error);
      //   }
      // );
    } else {
      console.log('Form is not valid');
      alert("Please fill the details first.")
    }
  }


}
