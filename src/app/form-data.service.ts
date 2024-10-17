import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private componentFormData = new BehaviorSubject<any>({});
  formData$ = this.componentFormData.asObservable();

  // Update the form data with the latest step's data
  updateFormData(step: string, data: any): void {
    const currentData = this.componentFormData.value;
    this.componentFormData.next({ ...currentData, [step]: data });
    console.log(data);
    
  }

  // Get the current form data
  getFormData(step: string):any {
    return this.componentFormData.value;
  }

   // Method to get all data
   getAllData(): any {
    return this.componentFormData.getValue();
  }

  // Method to clear form data (if needed)
  clearData(): void {
    this.componentFormData.next({});
  }
}
