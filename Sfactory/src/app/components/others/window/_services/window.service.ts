import { Inject, Injectable } from '@angular/core';
import { InjectionToken, FactoryProvider } from '@angular/core';
import { host_domain } from '../../../../../environments/domains';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  host:any;
  constructor(
    @Inject(WINDOW) private window: Window
    ) { }

    private local_host = host_domain.local_host;
    private non_prod = host_domain.non_prod;
    private demo = host_domain.demo;
    private prod = host_domain.prod;

    private non_prod_url = host_domain.non_prod;
    private demo_url = host_domain.demo;
    private prod_url = host_domain.prod;


  // This method will return the current host details.
  currenthost(){
    let current_host = this.window.location.hostname;
    if(current_host== this.local_host){
        this.host = this.non_prod_url;
    }else if(current_host== this.non_prod){
      this.host = this.non_prod_url;
    }else if(current_host== this.demo){
      this.host = this.demo_url;
    }else{
      this.host = this.prod_url;  
    }
    return this.host
  }




}


// This section will configure window property.
export const WINDOW = new InjectionToken<Window>('window');
const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};
export const WINDOW_PROVIDERS = [
    windowProvider
]
