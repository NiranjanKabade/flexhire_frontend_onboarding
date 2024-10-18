import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private componentFormData = new BehaviorSubject<{ [key: string]: any }>({});
  formData$ = this.componentFormData.asObservable();

  // Update the form data with the latest step's data
  updateFormData( data: any): void {
    const currentData = this.componentFormData.getValue();
    const updatedData = { ...currentData, ...data };
    this.componentFormData.next(updatedData);
    console.log(data);
    
  }

  // Get the current form data
  getFormData(stepKey: string):any {
    return this.componentFormData.getValue()[stepKey] || null;;
  }

   // Get form data for a specific step
   getFormDataForStep(stepKey: string) {
    return this.componentFormData.getValue()[stepKey] || null;
  }

   // Method to get all data
   getAllData(): any {
    return this.componentFormData.getValue();
  }

  // Method to clear form data (if needed)
  clearFormData(): void {
    this.componentFormData.next({});
  }
}
