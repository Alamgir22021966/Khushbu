import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentStocksComponent } from './current-stocks/current-stocks.component';
import { DailyPurchaseComponent } from './daily-purchase/daily-purchase.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'PurchaseReport'
    },
    children: [
      {
        path: '',
        redirectTo: 'currentstock', pathMatch: 'full'
      },
      {
        path: 'currentstock', component: CurrentStocksComponent,
        data: {
          title: 'Current Stock Reports'
        }
      },
      {
        path: 'dailypurchase', component: DailyPurchaseComponent,
        data: {
          title: 'Daily Purchase Report'
        }
      }
      


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }

export const routingComponents = [
  DailyPurchaseComponent,
  CurrentStocksComponent
  
]