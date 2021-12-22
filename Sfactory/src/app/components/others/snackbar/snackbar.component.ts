import { Component, OnInit, Injectable, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarComponent implements OnInit {

  message_text:string;
  action = "Dismiss";
  constructor( private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // This method will display the snack bar at bottom right.
  snackbar(msg_text){
    this.message_text = msg_text;
    this.snackBar.open(this.message_text , this.action, {
     duration:5000,
     horizontalPosition:"right",
     verticalPosition:"bottom",
    });
  }


  // This method will display the snack bar at top right.
  top_snackbar(msg_text:string, msg_type:string){
    let msg_bg:any;
    if(msg_type == "Successful"){
      msg_bg = "success-success"
    } else if(msg_type == "Unsuccessful"){
      msg_bg = "danger-unsuccess"
    }else if(msg_type == "warning"){
      msg_bg = "warning-warning"
    }else{
      msg_bg = "info-info"
    }


    this.message_text = msg_text;
    this.snackBar.open(this.message_text, this.action, {
     duration:5000,
     horizontalPosition:"right",
     verticalPosition:"top",
     panelClass: [msg_bg]
    });
  }


}
