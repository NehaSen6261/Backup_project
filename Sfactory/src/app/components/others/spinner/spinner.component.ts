import { Component, OnInit } from '@angular/core';
import { WindowService  } from '../../others/window/_services/window.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  current_host:any;
  constructor(private windowService:WindowService) { }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
  }

}
