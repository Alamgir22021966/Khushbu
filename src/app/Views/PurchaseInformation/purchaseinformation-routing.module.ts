import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { IteminfoComponent } from './ItemInformation/iteminfo.component';
import { PurchaseComponent } from './Purchase/purchase.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Purchase Component' },
    children: [
      {
        path: '', redirectTo: 'Adminpanel', pathMatch: 'full'
      },
      {
        path: 'Purchase', component: PurchaseComponent,
        data: { title: 'Purchase Component' }
      },
      {
        path: 'Categories', component: CategoriesComponent,
        data: { title: 'Categories Component' }
      },
      {
        path: 'ItemInformation', component: IteminfoComponent,
        data: { title: 'Item Information Component' }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseinformationRoutingModule { }

export const routingComponents = [
  PurchaseComponent,
  CategoriesComponent,
  IteminfoComponent,  
];