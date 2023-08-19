import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeComponent } from './BarCode/barcode.component';
import { NewsupplierComponent } from './Supplier/newsupplier.component';
import { NewuserComponent } from './User/newuser.component';
import { SupplierListComponent } from './SupplierList/supplier-list.component';
import { UserListComponent } from './UserList/user-list.component';

const routes: Routes = [
  {
    path: '', data: { title: 'New User Component' },
    children: [
      {
        path: '', redirectTo: 'Adminpanel', pathMatch: 'full'
      },
      {
        path: 'Newuser', component: NewuserComponent,
        data: { title: 'New User Component' }
      },
      {
        path: 'Userlist', component: UserListComponent,
        data: { title: 'User List Component' }
      },
      {
        path: 'Newsupplier', component: NewsupplierComponent,
        data: { title: 'New Supplier Component' }
      },
      {
        path: 'Supplierlist', component: SupplierListComponent,
        data: { title: 'Supplier List Component' }
      },
      {
        path: 'Barcode', component: BarcodeComponent,
        data: { title: 'Bar Code Component' }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminpanelRoutingModule { }

export const routingComponents = [
  NewuserComponent,
  UserListComponent,
  NewsupplierComponent,
  SupplierListComponent,
  BarcodeComponent
];