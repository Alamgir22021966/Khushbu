import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HtmlToPdfmakeComponent } from './html-to-pdfmake/html-to-pdfmake.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Payment Gateway Component' },
    children: [
      {
        path: '', redirectTo: 'PaymentGateway', pathMatch: 'full'
      },
      {
        path: 'PaymentGateway', component: PaymentGatewayComponent,
        data: { title: 'Payment Gateway Component' }
      },
      {
        path: 'HTMLtoPDF', component: HtmlToPdfmakeComponent,
        data: { title: 'Html To Pdfmake Component' }
      },
      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentGatewayRoutingModule { }

export const routingComponents = [
  PaymentGatewayComponent,
  HtmlToPdfmakeComponent
  
];
