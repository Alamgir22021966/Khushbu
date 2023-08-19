import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailySalesComponent } from './daily-sales/daily-sales.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { MonthlySalesComponent } from './monthly-sales/monthly-sales.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SalesReport'
    },
    children: [
      {
        path: '',
        redirectTo: 'dailysalesreport', pathMatch: 'full'
      },
      {
        path: 'dailysales', component: DailySalesComponent,
        data: {
          title: 'Daily Sales Report'
        }
      },
      {
        path: 'monthlysales', component: MonthlySalesComponent,
        data: {
          title: 'Monthly Sales Report'
        }
      },
      {
        path: 'InvoiceGenerator', component: InvoiceGeneratorComponent,
        data: {
          title: 'Invoice Generator Report'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }

export const routingComponents = [
  DailySalesComponent,
  MonthlySalesComponent,
  InvoiceGeneratorComponent,
  
]