import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-company-documentation',
  standalone: true,
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './company-documentation.component.html',
  styleUrl: './company-documentation.component.scss',
})
export class CompanyDocumentationComponent implements OnInit {
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

  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
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
    this.dataService.formData.subscribe((data) => {
      this.documentationForm.patchValue(data.step3);
    });
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

      if (file) {
        this.convertFileToBase64(file).then((base64) => {
          if (fileType === 'incorporation') {
            this.documentationForm.patchValue({ incorporationFile: base64 });
            this.documentationForm.patchValue({
              incorporationFileName: file.name,
            });
            // this.incorporationFileBase64 = base64 as string;
          } else if (fileType === 'businessLicense') {
            this.documentationForm.patchValue({ businessLicenseFile: base64 });
            this.documentationForm.patchValue({
              businessLicenseFileName: file.name,
            });
            // this.businessLicenseFileBase64 = base64 as string;
          } else if (fileType === 'insurance') {
            this.documentationForm.patchValue({ insuranceFile: base64 });
            this.documentationForm.patchValue({ insuranceFileName: file.name });
            this.insuranceFileBase64 = base64 as string;
          }
        });
      }
    }
  }
  // convertFileToBase64 is the function to convert file into Base64 string

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error); //
      };
      reader.readAsDataURL(file);
    });
  }
  // urlToBase64  is the function to convert file URL into Base64 string

  async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }
  // getFileIcon is the function to get icon using file extension

  getFileIcon(fileType: any) {
    const icons: { [key: string]: string } = {
      jpeg: './assets/jpeg.png',
      jpg: './assets/jpg.png',
      png: './assets/png.png',
      pdf: './assets/pdf.png',
    };
    return icons[fileType] || './assets/default.png';
  }

  // getFileExtensionFromBase64 is the function to get extension using base64 file string

  getFileExtensionFromBase64(base64String: string): string | null {
    const matches = base64String?.match(/data:([^;]+);base64/);
    if (matches && matches[1]) {
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1];
      return extension;
    }
    return null;
  }

  getFileNameFromBase64(
    base64String: string,
    defaultName: string = 'file'
  ): string {
    const matches = base64String.match(/data:([^;]+);base64/);

    if (matches && matches[1]) {
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1];

      return `${defaultName}.${extension}`;
    }

    return `${defaultName}.txt`;
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
  removeFile(file_type: string) {
    if (file_type == 'incorporationFile') {
      this.documentationForm.patchValue({ incorporationFile: '' });
    }
  }
  onNext() {
    if (this.documentationForm.valid) {
      this.dataService.updateStepData(3, this.documentationForm.value);
      this.next();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
        life: 3000,
      });
    }
  }

  // Method to handle the previous button click
  onPrevious() {
    if (this.previous) {
      this.previous();
    }
  }
}
