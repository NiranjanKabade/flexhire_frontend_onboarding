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
import { log } from 'console';

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
  combinedData: any; // To hold combined data from localStorage


  constructor(private messageService:MessageService, private dataService: DataService, private fb: FormBuilder){
    this.contactInfo = this.dataService.getData();
    console.log('Company Info:', this.contactInfo);

    this.documentationForm = this.fb.group({
      incorporationFile: [null, Validators.required],
      incorporationFileName: [''],
      businessLicenseFile: [null, Validators.required],
      businessLicenseFileName: [''],
      insuranceFile: [null, Validators.required],
      insuranceFileName: [''],
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
      console.log(file);
      

    // Convert the file to Base64 and store it in the respective property
    this.convertFileToBase64(file, (base64) => {
      if (base64) {
        if (fileType === 'incorporation') {
          this.documentationForm.patchValue({incorporationFile:file})
          this.documentationForm.patchValue({incorporationFileName:file.name})
          this.incorporationFileBase64 = base64 as string;
        } else if (fileType === 'businessLicense') {
          this.documentationForm.patchValue({businessLicenseFileName:file.name})
          this.businessLicenseFileBase64 = base64 as string;
        } else if (fileType === 'insurance') {
          this.documentationForm.patchValue({insuranceFileName:file.name})
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

  getFileIcon(fileType: any) {
    console.log(fileType);
    
    // const ext = fileType.split('/')[1];
    const icons: { [key: string]: string } = {
      'jpeg': './assets/jpeg.png',
      'jpg': './assets/jpg.png',
      'png': './assets/png.png',
      'pdf': './assets/pdf.png',
    };
    return icons[fileType] || './assets/default.png'; // default icon if the type is unknown
  }

  getFileExtensionFromBase64(base64String: string): string | null {
    // if (typeof base64String !== 'string') {
    //   console.error('Expected a string for base64String, received:', base64String);
    //   return null; // Return null if the input is not a string
    // }
  
    const matches = base64String.match(/data:([^;]+);base64/);
    if (matches && matches[1]) {
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1];
      return extension;
    }
    return null;
  }

getFileNameFromBase64(base64String: string, defaultName: string = 'file'): string {
    const matches = base64String.match(/data:([^;]+);base64/);
    
    if (matches && matches[1]) {
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1]; // Extract extension
  
      return `${defaultName}.${extension}`; // Combine with default name
    }
    
    return `${defaultName}.txt`; // Fallback if MIME type is not valid
  }


   // Function to patch the form data when returning to the page
   patchFileData(): void {
    const savedData = this.dataService.getData();

    if (savedData && savedData.documentationInfo) {
      const { documentationInfo } = savedData;
      // const data = JSON.parse(documentationInfo)
      // console.log(data.incorporationFile);
      // console.log(documentationInfo.incorporationFile);
      

      // Patch the form with Base64 strings if available
      if (documentationInfo.incorporationFile) {
        this.documentationForm.patchValue({ 
          incorporationFile: documentationInfo.incorporationFile,
          incorporationFileName: documentationInfo.incorporationFileName 
         });
        // console.log(this.documentationForm);
        

        
      }
      if (documentationInfo.businessLicenseFile) {
        this.documentationForm.patchValue({ 
          businessLicenseFile: documentationInfo.businessLicenseFile,
          businessLicenseFileName: documentationInfo.businessLicenseFileName
         });
      }
      if (documentationInfo.insuranceFile) {
        this.documentationForm.patchValue({ 
          insuranceFile: documentationInfo.insuranceFile,
          insuranceFileName: documentationInfo.insuranceFileName
         });
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
   

    if (this.incorporationFile && this.businessLicenseFile && this.insuranceFile) {
      
      const companyDocumentationData = {
        incorporationFile: this.incorporationFileBase64,
        incorporationFileName: this.documentationForm.value.incorporationFileName, // Add file name
        businessLicenseFile: this.businessLicenseFileBase64,
        businessLicenseFileName: this.documentationForm.value.businessLicenseFileName, // Add file name
        insuranceFile: this.insuranceFileBase64,
        insuranceFileName: this.documentationForm.value.insuranceFileName, // Add file name
      };

       // Load the combined data after saving
           // Combine all data
           const allData = {
            ...this.dataService.getData(),
            documentationInfo: companyDocumentationData
          };
     console.log(allData);
     
      // Save combined data using the dataService's setData method
    this.dataService.setData(allData);

      
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
