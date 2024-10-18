import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Initialize BehaviorSubject with a default value
  private dataSubject = new BehaviorSubject<any>(null);
  // Observable for components to subscribe to
  data$ = this.dataSubject.asObservable();

  // Method to set data
  setData(value: any) {
    this.dataSubject.next(value);
  }

  // Method to get the current data
  getData() {
    return this.dataSubject.getValue();
  }
}
