import { Injectable } from '@angular/core';
import { images_domain } from '../../../../environments/domains';



@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  Title:string;
  public images_domain=images_domain.image_url;
  constructor() { }
}
