import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesListComponent } from './SalesList/sales-list.component';
import { SalesComponent } from './Sales/sales.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Sales Component' },
    children: [
      {
        path: '', redirectTo: 'SalesInformation', pathMatch: 'full'
      },
      {
        path: 'Sales', component: SalesComponent,
        data: { title: 'Sales Component' }
      },
      {
        path: 'SalesList', component: SalesListComponent,
        data: { title: 'Sales List Component' }
      },
      // {
      //   path: 'ItemInformation', component: IteminfoComponent,
      //   data: { title: 'Item Information Component' }
      // },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesInformationRoutingModule { }

export const routingComponents = [
  SalesComponent,
  SalesListComponent
];
