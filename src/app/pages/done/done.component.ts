import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [CommonModule],
  providers:[MessageService],
  templateUrl: './done.component.html',
  styleUrl: './done.component.scss'
})
export class DoneComponent implements OnInit{

  // companyDocumentation: any;
  allFormData: any;

  constructor( private dataService: DataService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService){}

  ngOnInit(): void {
    this.loadAllFormData();
  }

  loadAllFormData(): void {
    this.allFormData = this.dataService.getData(); // Retrieve all data from DataService
    console.log(this.allFormData);
    
  }

  submitData(): void {
    // Here you can replace the URL with your actual backend API endpoint
    const apiUrl = 'https://your-backend-api-endpoint.com/submit'; 
    
    this.http.post(apiUrl, this.allFormData).subscribe(
      response => {
        console.log('Data submitted successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data submitted successfully!' });
        
        localStorage.removeItem('formData'); // Use the correct key for your local storage
        this.dataService.clearData(); // Clear data from DataService if needed
        // this.router.navigate(['/success']); // Navigate to a success page or back to the dashboard
      },
      error => {
        console.error('Error submitting data:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit data.' });
      }
    );
  }
}
