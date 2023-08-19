import { NgModule } from '@angular/core';
import { PurchaseRoutingModule, routingComponents } from './purchase-routing.module';
import { SharedModule } from '@/Shared/shared.module';
import { CurrentStocksComponent } from './current-stocks/current-stocks.component';
// import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    routingComponents,
    CurrentStocksComponent
  ],
  imports: [
    PurchaseRoutingModule,
    SharedModule,
    // NgSelectModule,
  ]
})
export class PurchaseModule { }
