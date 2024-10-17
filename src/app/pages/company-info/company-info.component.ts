import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormDataService } from '../../form-data.service';



@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatSelectModule,CommonModule,MatButtonModule,InputTextModule, FloatLabelModule],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss'
})
export class CompanyInfoComponent implements OnInit{

  @Output() save = new EventEmitter<any>();
  companyForm: FormGroup;
  value: string | undefined;


  constructor(private fb: FormBuilder, private formDataService: FormDataService) {
    this.companyForm = this.fb.group({
      companyName: [''],
      businessRegNumber: [''],
      taxIdentificationNumber: [''],
      website: [''],
      description: [''],
      industry: [''],
      size: ['']
    });

   
  }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      businessRegNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,12}$')]], // Example pattern for business registration number
      taxIdentificationNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Example TIN validation
      website: ['', [Validators.required,Validators.pattern('https?://.+')]], // Validates if it's a valid URL format
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      industry: ['', Validators.required],
      size: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(100000)]]
    });

    //  // Load cached data
    //  const cachedData = this.formDataService.getFormData('companyInfo');
    //  if (cachedData) {
    //    this.companyForm.patchValue(cachedData);
    //  }
  }

  onSave() {
    if (this.companyForm.valid) {
      this.formDataService.updateFormData('companyInfo', this.companyForm.value);
    }
  }

  // get companies(): FormArray {
  //   return this.companyForm.get('companies') as FormArray;
  // }

  // createCompanyGroup(): FormGroup {
  //   return this.fb.group({
  //     companyName: ['', Validators.required],
  //     companyDescription: ['', Validators.required],
  //     website: ['', [Validators.required, Validators.pattern('https?://.+')]],
  //   });
  // }

  // addCompany(): void {
  //   this.companies.push(this.createCompanyGroup());
  // }

  // removeCompany(index: number): void {
  //   if (this.companies.length > 1) {
  //     this.companies.removeAt(index);
  //   }
  // }

  // onSubmit(): void {
  //   if (this.companyForm.valid) {
  //     console.log(this.companyForm.value);
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }
  
  onNext() {
    if (this.companyForm.valid) {
      // Perform actions like submitting form data
      this.save.emit(this.companyForm.value);
      console.log(this.companyForm.value);
    } else {
      this.companyForm.markAllAsTouched(); // Marks all fields as touched to trigger validation messages
    }
  }

  get f() {
    return this.companyForm.controls as {
      [key: string]: any; // Or more specifically typed based on the form control structure
      companyName: any;
      businessRegNumber: any;
      taxIdentificationNumber: any;
      website: any;
      description: any;
      industry: any;
      size: any;
    };
  }
}
