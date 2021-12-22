import { interval } from 'rxjs';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit  {
  title = 'SFactrix';

constructor(
  private updateclient: SwUpdate,
  private appRef: ApplicationRef,
){
  this.updateClient();
  this.checkAppupdate();
}

  ngOnInit(): void { }

  updateClient(){
    if(!this.updateclient.isEnabled){

      return;
    }
    this.updateclient.available.subscribe((event) =>{
      if(confirm("Update available for the app please confirm")){
        this.updateclient.activateUpdate().then(() => location.reload());
      }
     })
    this.updateclient.activated.subscribe((event) =>{
    })
  }

checkAppupdate(){
  this.appRef.isStable.subscribe((isStable) =>{
    if(isStable){
      const timeinterval = interval(24 * 60 * 60 * 1000);
      timeinterval.subscribe(() =>{
        this.updateclient.checkForUpdate().then(() => console.log('checked'));
      })
    }
  })
}
onActivate(event) {
  window.scroll(0,0);
}

}