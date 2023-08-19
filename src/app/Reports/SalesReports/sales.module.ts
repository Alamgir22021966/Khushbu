import { NgModule } from '@angular/core';

import { routingComponents, SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '@/Shared/shared.module';
import { MonthlySalesComponent } from './monthly-sales/monthly-sales.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    routingComponents,
    MonthlySalesComponent,
  ],
  imports: [
    SalesRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class SalesModule { }
