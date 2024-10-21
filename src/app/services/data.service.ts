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
  
  private apiUrl = 'https://restcountries.com/v2/all'; // Replace with your API endpoint
  // Initialize BehaviorSubject with a default value
  private dataSubject = new BehaviorSubject<any>(null);
  // Observable for components to subscribe to
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl);
  }

  // Method to set data
  setData(data: any) {
    this.dataSubject.next(data);
  }

  // Method to get the current data
  getData() {
    return this.dataSubject.getValue();
  }

  // Optional: You can add a reset method to clear data if needed
  resetData() {
    this.dataSubject.next(null);
  }
}
