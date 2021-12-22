import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../navbar/_services/navbar.service';
import { OthersService } from '../others/_services/others.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent implements OnInit {
  public img_logo_color: string;
  stateName='yellowbox'
  constructor( private othersService:OthersService, private navbarService: NavbarService,) {
    this.img_logo_color = this.othersService.images_domain +"sfactory_logo.png";
    this.navbarService.Title = "Activation";
    this.othersService.setTitle( this.navbarService.Title);    
    this.stateName = this.stateName === 'yellowbox' ? 'redbox' : 'yellowbox'  
   }


  ngOnInit(): void {
  }

}
