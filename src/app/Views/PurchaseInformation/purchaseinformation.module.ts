import { NgModule } from '@angular/core';

import { PurchaseinformationRoutingModule, routingComponents } from './purchaseinformation-routing.module';
import { SharedModule } from '@/Shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    routingComponents
  ],
  imports: [
    PurchaseinformationRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class PurchaseinformationModule { }
