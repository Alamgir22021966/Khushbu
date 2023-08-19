import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentGatewayRoutingModule, routingComponents } from './payment-gateway-routing.module';
import { HtmlToPdfmakeComponent } from './html-to-pdfmake/html-to-pdfmake.component';


@NgModule({
  declarations: [
    routingComponents,
    HtmlToPdfmakeComponent
  ],
  imports: [
    CommonModule,
    PaymentGatewayRoutingModule
  ]
})
export class PaymentGatewayModule { }
