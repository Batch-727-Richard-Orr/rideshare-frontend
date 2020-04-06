import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor( private router: Router) { }
  showCont: boolean = false;
  showCar: boolean = false;
  showLocation: boolean = false;
  showMemberInfo: boolean = false;

  contact: string = '';
  car: string = '';
  location: string = '';
  membership: string = '';

  ngOnInit() {
    this.showCont = true;
}
  showContact() {
    this.showCont = true;
    this.showCar = false;
    this.showLocation = false;
    this.showMemberInfo = false;
    
    this.contact = 'profileBtn';
    this.car = '';
    this.location = '';
    this.membership = '';

  }

  showLoc(){
    this.showCont = false;
    this.showCar = false;
    this.showLocation = true;
    this.showMemberInfo = false;
    
    this.contact = '';
    this.car = '';
    this.location = 'profileBtn';
    this.membership = '';
  }

  showMembership(){
    this.showCont = false;
    this.showCar = false;
    this.showLocation = false;
    this.showMemberInfo = true;
    
    this.contact = '';
    this.car = '';
    this.location = '';
    this.membership = 'profileBtn';
  }

  showCarInfo(){
    this.showCont = false;
    this.showCar = true;
    this.showLocation = false;
    this.showMemberInfo = false;
    
    this.contact = '';
    this.car = 'profileBtn';
    this.location = ''; 
    this.membership = '';

  }
}