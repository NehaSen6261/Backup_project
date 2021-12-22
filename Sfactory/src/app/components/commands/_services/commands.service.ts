import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { commands } from 'src/environments/urls';
import { AuthService } from '../../login/_services/auth.service';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  private get_tenant_commands = commands.get_tenant_commands;
  private getCommandInfo = commands.get_Command_Info;
  private get_device_commands = commands.get_device_commands;
  private command_adddevice = commands.post_command_add_device;
  private deleteCommand = commands.delete_command;

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private authService:AuthService,
    private snackBar: SnackbarComponent,
    private router:Router
  ) { }

   //  This method will call the API to post the data
  postCommanddeviceS(post_data:any){
    return this.http.post(this.command_adddevice , post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
    }))
   }

  // This method will call the API for  deleting the command
  deleteCommandS(cmd_id){
  return this.http.delete(this.deleteCommand + cmd_id).pipe(map(response=>{
    if(response['Successful']){
      this.response_status = "Successful";
      this.router.navigate(['/command']);
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }))
  }

  // This function will call the API for GET method, It will display the all the commands  by tenant id.
  getCommandsS(){
      return this.http.get(this.get_tenant_commands + this.authService.currentUser['tenant_id']);
  }

  // This function will  call the API for GET method, It will display the command  info by command id.
  getCommandInfoS(command_id:any){
       return this.http.get(this.getCommandInfo + command_id);
  }

  // This function will  call the API for GET method, It will display the device command  list by dev eui.
  getDeviceCommands(euiid:any){
      return this.http.get(this.get_device_commands + euiid)
  }

}
