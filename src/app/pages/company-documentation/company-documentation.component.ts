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


 
  uploadedFiles: File[] = [];

  constructor(private formDataService: FormDataService, private http: HttpClient, private fb:FormBuilder, private messageService: MessageService ) {
 
  }



  

  onUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
}
}
