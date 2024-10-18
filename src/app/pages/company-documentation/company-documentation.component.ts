import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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
  incorporationFile: File | null = null;
  businessLicenseFile: File | null = null;
  insuranceFile: File | null = null;

  @Input() next!: () => void; // Input for the next function


  constructor(private http:HttpClient, private messageService:MessageService){}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent, type: string) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      switch (type) {
        case 'incorporation':
          this.incorporationFile = files[0];
          break;
        case 'businessLicense':
          this.businessLicenseFile = files[0];
          break;
        case 'insurance':
          this.insuranceFile = files[0];
          break;
      }
    }
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  onFileSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

      if (validFileTypes.includes(file.type)) {
        switch (type) {
          case 'incorporation':
            this.incorporationFile = file;
            break;
          case 'businessLicense':
            this.businessLicenseFile = file;
            break;
          case 'insurance':
            this.insuranceFile = file;
            break;
        }
      } else {
        this.showToast('error', 'Invalid file type!', 'Please upload a JPEG, PNG, or PDF file.');
        input.value = ''; // Clear the input
      }
    } 
  }

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  onNext() {
    // if (this.contactForm.invalid) {
    //   // Call the injected next function from the DashboardComponent
    //   this.next(); // Call the injected next function
    // } else {
    //   alert('Please fill in all required fields.');
    // }
    this.next(); // Call the injected next function

  }
}
