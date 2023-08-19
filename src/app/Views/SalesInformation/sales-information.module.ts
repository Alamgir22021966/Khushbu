import { SharedModule } from '@/Shared/shared.module';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { routingComponents, SalesInformationRoutingModule } from './sales-information-routing.module';
import { SalesListComponent } from './SalesList/sales-list.component';


@NgModule({
  declarations: [
    routingComponents,
    SalesListComponent
  ],
  imports: [
    SalesInformationRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class SalesInformationModule { }
