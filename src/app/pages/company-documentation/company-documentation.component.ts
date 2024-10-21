import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

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
export class CompanyDocumentationComponent implements OnInit{
  documentationForm: FormGroup;
  incorporationFile: File | null = null;
  businessLicenseFile: File | null = null;
  insuranceFile: File | null = null;

  incorporationFileBase64: string | null = null;
  businessLicenseFileBase64: string | null = null;
  insuranceFileBase64: string | null = null;

  @Input() next!: () => void; // Input for the next function
  @Input() previous!: () => void; 
  

  contactInfo: any;


  constructor(private messageService:MessageService, private dataService: DataService, private fb: FormBuilder){
    this.contactInfo = this.dataService.getData();
    console.log('Company Info:', this.contactInfo);

    this.documentationForm = this.fb.group({
      incorporationFile: [null, Validators.required],
      businessLicenseFile: [null, Validators.required],
      insuranceFile: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.patchFileData();
  }

  convertFileToBase64(file: File, callback: (base64: string | ArrayBuffer | null) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result); // reader.result contains the Base64 string
    };
    reader.onerror = (error) => {
      console.error('Error converting file to Base64:', error);
      callback(null); // Handle error cases by returning null
    };
    reader.readAsDataURL(file); // Converts the file to a Base64 data URL
  }

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

  onFileSelected(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

     // Convert the file to Base64 and store it in the respective property
    this.convertFileToBase64(file, (base64) => {
      if (base64) {
        if (fileType === 'incorporation') {
          this.incorporationFileBase64 = base64 as string;
        } else if (fileType === 'businessLicense') {
          this.businessLicenseFileBase64 = base64 as string;
        } else if (fileType === 'insurance') {
          this.insuranceFileBase64 = base64 as string;
        }
      }
    });
    
    const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (validFileTypes.includes(file.type)) {
      switch (fileType) {
        case 'incorporation':
          this.incorporationFile = file;
          this.convertFileToBase64(file, (base64) => {
            this.incorporationFileBase64 = base64 as string;
            this.documentationForm.patchValue({ incorporationFile: file });
          });
          break;
        case 'businessLicense':
          this.businessLicenseFile = file;
          this.convertFileToBase64(file, (base64) => {
            this.businessLicenseFileBase64 = base64 as string;
            this.documentationForm.patchValue({ businessLicenseFile: file });
          });
          break;
        case 'insurance':
          this.insuranceFile = file;
          this.convertFileToBase64(file, (base64) => {
            this.insuranceFileBase64 = base64 as string;
            this.documentationForm.patchValue({ insuranceFile: file });
          });
          break;
        }
      } else {
        this.showToast('error', 'Invalid file type!', 'Please upload a JPEG, PNG, or PDF file.');
        input.value = ''; // Clear the input
      }
    } 
  }

   // Function to patch the form data when returning to the page
   patchFileData(): void {
    const savedData = this.dataService.getData();
    console.log();
    
    if (savedData?.documentationInfo) {
      const { incorporationFile, businessLicenseFile, insuranceFile } = savedData.documentationInfo;
  
      // Patch Base64 data into the form (you can store the Base64 for UI display if needed)
      this.incorporationFileBase64 = incorporationFile || '';
      this.businessLicenseFileBase64 = businessLicenseFile || '';
      this.insuranceFileBase64 = insuranceFile || '';

      // Update UI and form with the Base64 data if available
      if (incorporationFile) {
        this.incorporationFile = this.convertBase64ToFile(incorporationFile, 'incorporationFile');
        this.documentationForm.patchValue({ incorporationFile: this.incorporationFile });
      }
      if (businessLicenseFile) {
        this.businessLicenseFile = this.convertBase64ToFile(businessLicenseFile, 'businessLicenseFile');
        this.documentationForm.patchValue({ businessLicenseFile: this.businessLicenseFile });
      }
      if (insuranceFile) {
        this.insuranceFile = this.convertBase64ToFile(insuranceFile, 'insuranceFile');
        this.documentationForm.patchValue({ insuranceFile: this.insuranceFile });
      }
    }
  }

  convertBase64ToFile(base64: string, fileName: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], fileName, { type: mime });
  }
  
  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }



 

  onNext() {
    // Retrieve data from the DataService
    const combinedData = this.dataService.getData();

    if (this.incorporationFile && this.businessLicenseFile && this.insuranceFile) {
      const companyDocumentationData = {
        // incorporationFile: this.incorporationFile,
        // businessLicenseFile: this.businessLicenseFile,
        // insuranceFile: this.insuranceFile,

        incorporationFile: this.incorporationFileBase64,
        businessLicenseFile: this.businessLicenseFileBase64,
        insuranceFile: this.insuranceFileBase64,
      };

       // Combine all data
       const allData = {
        ...combinedData,
        documentationInfo: companyDocumentationData
      };

      this.dataService.setData(allData);
      this.showToast('success', 'Files saved', 'Documentation files have been saved successfully.');
      // Call the injected next function from the DashboardComponent
      this.next(); // Call the injected next function

      
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
        life: 3000 // Duration in milliseconds
      });
    }
  }



   // Method to handle the previous button click
   onPrevious() {
    if (this.previous) {
      this.previous(); // Call the injected previous function
    }
  }

 
}
