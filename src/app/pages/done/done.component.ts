import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [],
  templateUrl: './done.component.html',
  styleUrl: './done.component.scss'
})
export class DoneComponent implements OnInit{

  companyDocumentation: any;

  constructor(private dataService: DataService){}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject to get the latest data
    // this.dataService.data$.subscribe(data => {
    //   this.companyDocumentation = data;
    //   console.log('Company Documentation Data:', this.companyDocumentation);
    // });
  }
}
