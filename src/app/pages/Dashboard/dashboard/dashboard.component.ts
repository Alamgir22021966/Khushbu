import {Component} from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    public user: any=[];

    constructor(private location:Location){}
  
    public ngOnInit(): void {
      this.user = this.location.getState();
      console.log(this.user);
    }

   
}
