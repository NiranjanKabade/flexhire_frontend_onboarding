import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormDataService } from '../../form-data.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule,
    FloatLabelModule, InputTextModule
  ],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit{

  @Output() save = new EventEmitter<any>();
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private formDataService: FormDataService) {
    this.contactForm = this.fb.group({
      contacts: this.fb.array([this.createContact()])
    });

    // // Load cached data
    // const cachedData = this.formDataService.getFormData('contactInfo');
    // if (cachedData) {
    //   this.contactForm.patchValue(cachedData);
    // }
  }


  onSave() {
    if (this.contactForm.valid) {
      this.formDataService.updateFormData('contactInfo', this.contactForm.value);
    }
  }

  ngOnInit(): void {
    this.addContact()
  }

  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray;
  }

  // Method to create a new FormGroup for a contact
  createContact(): FormGroup {
    return this.fb.group({
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Example: 10 digit phone number
      emailAddress: ['', [Validators.required, Validators.email]], // Email validation
      position: ['', Validators.required]
    });
  }
  onNext() {
    if (this.contactForm.valid) {
      this.save.emit(this.contactForm.value);
      console.log(this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  addContact(): void {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  // onSubmit(): void {
  //   if (this.contactForm.valid) {
  //     console.log(this.contactForm.value);
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

}
