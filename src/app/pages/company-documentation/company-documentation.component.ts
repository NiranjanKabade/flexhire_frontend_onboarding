import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormDataService } from '../../form-data.service';
import { HttpClient } from '@angular/common/http';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}


@Component({
  selector: 'app-company-documentation',
  standalone: true,
  imports: [FloatLabelModule,ReactiveFormsModule,CommonModule,FileUploadModule,ToastModule],
  providers: [MessageService],
  templateUrl: './company-documentation.component.html',
  styleUrl: './company-documentation.component.scss'
})
export class CompanyDocumentationComponent {

  @Output() save = new EventEmitter<any>();
  @Output() submit = new EventEmitter<void>();

  constructor(private formDataService: FormDataService,private messageService: MessageService, private http: HttpClient ) {}

  onUpload() {
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  submitForm() {
   // Retrieve the complete form data from the service
   const completeFormData = this.formDataService.getFormData();

   // Make an HTTP POST request to submit the data to the backend
   this.http.post('https://your-backend-url.com/submit', completeFormData).subscribe(
     (response) => {
       console.log('Form submitted successfully', response);
     },
     (error) => {
       console.error('Error submitting form', error);
     }
   );
  }
}
