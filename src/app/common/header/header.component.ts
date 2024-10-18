import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,MatButtonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isActive : any;
  menuOpen: boolean = false;

  constructor(private router:Router,private authService: AuthService){}

  ngOnInit(): void {
    console.log(this.router.url);
    // if(this.router.url=='/home'){
    //   this.isActive=1
    // }
    // else if(this.router.url=='/about'){
    //   this.isActive=2
    // }
    // else if(this.router.url=='/services'){
    //   this.isActive=3
    // }
    // else if(this.router.url=='/contact'){
    //   this.isActive=4
    // }
    // else if(this.router.url=='/addtocart'){
    //   this.isActive=5
    // }
    // else{
    //   this.isActive=0 
    // }
  }
  onClick(id:any,name:any){
    this.isActive = id
    this.router.navigate([`/${name}`])
    if(this.menuOpen){
      this.toggleMenu();
     
    }
    
  }

  OnClose(){
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(){
    this.authService.logout();
  } 

}
