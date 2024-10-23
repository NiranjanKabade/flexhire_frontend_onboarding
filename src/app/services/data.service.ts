import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Country {
  name: string;
  alpha2Code: string; // ISO 3166-1 alpha-2 code
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //Created by suraj*******************************

  private formDataSubject = new BehaviorSubject<any>({
    step1: {},
    step2: {},
    step3: {},
  });

  formData = this.formDataSubject.asObservable();

  updateStepData(step: number, data: any) {
    const currentData = this.formDataSubject.value;
    this.formDataSubject.next({
      ...currentData,
      [`step${step}`]: { ...currentData[`step${step}`], ...data },
    });
  }
  //********************************************/

  private storageKey = 'formData';

  private apiUrl = 'https://restcountries.com/v2/all'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl);
  }

  // Method to set data
  setData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Method to get the current data
  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearData(): void {
    localStorage.removeItem(this.storageKey);
  }
}
