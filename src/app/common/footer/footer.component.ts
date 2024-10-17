import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  isActive : any;

  constructor(private route:Router){
    
  }
  ngOnInit(): void {
    
  }
  onClick(id:any,name:any){
    this.isActive = id
    this.route.navigate([`/${name}`])
  } 
}
