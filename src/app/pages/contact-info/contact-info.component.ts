import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormDataService } from '../../services/form-data.service';

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

  @Output() next = new EventEmitter<void>();
  contactForm: FormGroup;


  constructor(private fb: FormBuilder, private formDataService: FormDataService, private http: HttpClient,  private router: Router) {
    // Initialize the FormArray with one contact form
  this.contactForm = this.fb.group({
    contacts: this.fb.array([this.createContact()]), // Start with one contact
  });
  }

  ngOnInit(): void {}

  // onSave() {
  //   if (this.contactForm.valid) {
  //     this.formDataService.updateFormData('contactInfo', this.contactForm.value);
  //   }
  // }



  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray; // Ensure this returns a FormArray
  }

  // // Method to create a new FormGroup for a contact
  createContact(): FormGroup {
    return this.fb.group({
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      emailAddress: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
    });
  }

  addContact(): void {
    // Make sure contacts is not null before calling push
    this.contacts.push(this.createContact());
  }
  

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  // onNext() {
  //   if (this.contactForm.valid) {
  //     // Save form data to the service
  //     this.formDataService.updateFormData(this.contactForm.value);
  //     this.next.emit(); // Emit the next event
  //     console.log("Data saved successfully for Component One");
  //     // this.router.navigate(['/company-document']);

  //     // Make an API call to save the data of this specific component
  //     // this.http.post('your-api-endpoint/componentTwo', this.contactForm.value).subscribe(
  //     //   response => {
  //     //     console.log('Data saved successfully for Component Two:', response);
  //     //   },
  //     //   error => {
  //     //     console.error('Error saving data for Component Two:', error);
  //     //   }
  //     // );
  //   } else {
  //     console.log('Form is not valid');
  //   }
  // }

 
  }




