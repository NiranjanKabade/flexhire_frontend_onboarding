import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule,
    FloatLabelModule, InputTextModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
  
})
export class ContactInfoComponent implements OnInit{

  @Input() next!: () => void; // Input for the next function
  @Input() previous!: () => void; 


  contactForm: FormGroup;
  companyInfo: any; // To store the retrieved company info
  savedData: any;    // Store the saved data


  private numberToWords: string[] = [
     'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'
  ];

  constructor(private fb: FormBuilder, private dataService:DataService, private http: HttpClient,  private router: Router, private messageService: MessageService) {
    // Initialize the FormArray with one contact form
  this.contactForm = this.fb.group({
    contacts: this.fb.array([this.createContact()]), // Start with one contact
    hrcontacts: this.fb.array([this.createHrContact()]),
  });


   // Load previously saved company info data
   this.companyInfo = this.dataService.getData();
   console.log('Company Info:', this.companyInfo);

  
  }

  ngOnInit(): void {

     // Load the previously saved data (if any) and patch it to the form
     this.savedData = this.dataService.getData();
    
     if (this.savedData?.contactInfo) {
       // Patch contact info data
       this.contactForm.patchValue({
         contacts: this.savedData.contactInfo.contacts,
         hrcontacts: this.savedData.contactInfo.hrcontacts
       });
       
       // For dynamic fields in FormArray, patch manually
       this.patchFormArray(this.contacts, this.savedData.contactInfo.contacts);
       this.patchFormArray(this.hrcontacts, this.savedData.contactInfo.hrcontacts);
     }
 
    
  }


  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray; // Ensure this returns a FormArray
  }

  get hrcontacts(): FormArray{
    return this.contactForm.get('hrcontacts') as FormArray;
  }



  // // Method to create a new FormGroup for a contact
  createContact(): FormGroup {
    return this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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
      job_title: ['', Validators.required]
    });
  }


  addContact(): void {
    // Make sure contacts is not null before calling push
    this.contacts.push(this.createContact());
    this.hrcontacts.push(this.createContact());
  }
  

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
    if(this.hrcontacts.length > 1){
      this.hrcontacts.removeAt(index);
    }
  }

  addHrContact() {
    this.hrcontacts.push(this.createHrContact());
  }

  removeHrContact(index: number) {
    this.hrcontacts.removeAt(index);
  }

    // Helper method to patch a FormArray
    patchFormArray(formArray: FormArray, data: any[]) {
      formArray.clear();
      data.forEach(item => {
        formArray.push(this.fb.group(item));
      });
    }

     // Convert index to word
     indexToWord(index: number):string {
      if (index >= 0 && index < this.numberToWords.length) {
        return this.numberToWords[index];
      }
      return "";
    }

  
    onNext() {
      if (this.contactForm.valid) {
         // Store the contact form data if needed
      const contactData = this.contactForm.value;

      // Optionally, you can also combine it with the company info
      const combinedData = {
        companyInfo: this.companyInfo,
        contactInfo: contactData,
      };

      // You can save the combined data using the service if needed
      this.dataService.setData(combinedData);

        // Call the injected next function from the DashboardComponent
        this.next(); // Call the injected next function
      } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
        life: 3000 // Duration in milliseconds
      });
          this.contactForm.markAllAsTouched();
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




