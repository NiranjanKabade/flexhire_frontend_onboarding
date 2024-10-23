import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss',
})
export class CompanyInfoComponent implements OnInit {
  @Input() next!: () => void;
  @Input() previous!: () => void;

  companyForm: FormGroup;
  countries: Country[] = [];
  formKey = 'companyInfo';
  savedData: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
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
      ],
      taxIdentificationNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{11}$')],
      ],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
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
      country: ['', Validators.required],
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
    this.dataService.formData.subscribe((data) => {
      this.companyForm.patchValue(data.step1);
    });
    this.loadCountries();
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
      this.dataService.updateStepData(1, this.companyForm.value);
      this.next();
    } else {
      this.companyForm.markAllAsTouched();
      return;
    }
  }

  // Method to handle the previous button click
  onPrevious() {
    if (this.previous) {
      this.previous();
    }
  }
}
