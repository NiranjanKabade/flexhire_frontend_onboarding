import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FloatLabelModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss',
})
export class ContactInfoComponent implements OnInit {
  @Input() next!: () => void; // Input for the next function
  @Input() previous!: () => void;

  contactForm: FormGroup;
  companyInfo: any; // To store the retrieved company info
  savedData: any; // Store the saved data

  private numberToWords: string[] = [
    'First',
    'Second',
    'Third',
    'Forth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      contacts: this.fb.array([this.createContact()]), // Start with one contact
      hrcontacts: this.fb.array([this.createHrContact()]),
    });
  }

  ngOnInit(): void {
    this.dataService.formData.subscribe((data) => {
      if (data?.step2) {
        this.patchFormArray(this.contacts, data?.step2?.contacts);
        this.patchFormArray(this.hrcontacts, data?.step2?.hrcontacts);
      }
    });
  }

  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray; // Ensure this returns a FormArray
  }

  get hrcontacts(): FormArray {
    return this.contactForm.get('hrcontacts') as FormArray;
  }

  // Method to create a new FormGroup for a contact
  createContact(): FormGroup {
    return this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email_address: ['', [Validators.required, Validators.email]],
      job_title: ['', Validators.required],
    });
  }

  createHrContact(): FormGroup {
    return this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email_address: ['', [Validators.required, Validators.email]],
      job_title: ['', Validators.required],
    });
  }

  addContact(): void {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  addHrContact() {
    this.hrcontacts.push(this.createHrContact());
  }

  removeHrContact(index: number) {
    if (this.hrcontacts.length > 1) {
      this.hrcontacts.removeAt(index);
    }
  }

  patchFormArray(formArray: FormArray, data: any[]) {
    formArray.clear();
    data?.forEach((item) => {
      formArray.push(this.fb.group(item));
    });
  }

  indexToWord(index: number): string {
    if (index >= 0 && index < this.numberToWords.length) {
      return this.numberToWords[index];
    }
    return '';
  }

  onNext() {
    if (this.contactForm.valid) {
      this.dataService.updateStepData(2, this.contactForm.value);

      this.next();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
        life: 3000,
      });
      this.contactForm.markAllAsTouched();
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
