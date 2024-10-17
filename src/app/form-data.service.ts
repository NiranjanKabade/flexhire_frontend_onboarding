import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FormData {
  companyInfo: any;
  contactInfo: any;
  companyDocs: any;
}

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private initialFormData: FormData  = {
    companyInfo: null,
    contactInfo: null,
    companyDocs: null,
  
  };

  private formDataSubject = new BehaviorSubject<any>(this.initialFormData);
  formData$ = this.formDataSubject.asObservable();

   // Update the form data with the latest step's data
   updateFormData(step: string, data: any) {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, [step]: data };
    this.formDataSubject.next(updatedData);
  }

  // Get the current form data
  getFormData() {
    return this.formDataSubject.value;
  }

  // constructor(
  //   private http: HttpClient,
  //   @Inject(PLATFORM_ID) private platformId: Object
  // ) {}

  // setFormData(step: string, data: any) {
  //   const currentData = this.formData.value;
  //   currentData[step] = data;
  //   this.formData.next(currentData);

  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('formData', JSON.stringify(currentData));
  //   }
  // }

  // getFormData(step: string) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const storedData = localStorage.getItem('formData');
  //     if (storedData) {
  //       return JSON.parse(storedData)[step];
  //     }
  //   }
  //   return this.formData.value[step];
  // }

  // submitData() {
  //   const data = this.formData.value;
  //   return this.http.post('http://your-django-api-url.com/submit', data);
  // }
}
