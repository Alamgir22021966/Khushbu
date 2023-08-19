import { NgModule } from '@angular/core';
import { AdminpanelRoutingModule, routingComponents } from './adminpanel-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SharedModule } from '@/Shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalSupplierComponent } from './SupplierList/modal-supplier.component';
import { EditUserComponent } from './UserList/edit-user.component';
import { FocusDirective } from '@/Directive/focus.directive';
import { SearchComponent } from '@/modals/search/search.component';
import { NumberOnlyDirective } from '@/Directive/number-only.directive';


@NgModule({
  declarations: [
    routingComponents,
    ModalSupplierComponent,
    EditUserComponent,
    FocusDirective,
    NumberOnlyDirective,
    
  ],
  imports: [
    AdminpanelRoutingModule,
    SharedModule,
    NgSelectModule,
    NgxBarcodeModule,
    BsDatepickerModule.forRoot(),
    
  ],
    // entryComponents: [
    //     SearchComponent,
    // ],
  providers: [
    // SharedService
  ],
  
})
export class AdminpanelModule { }
