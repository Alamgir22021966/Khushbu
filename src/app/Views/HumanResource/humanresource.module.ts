import { NgModule } from '@angular/core';
import { HumanresourceRoutingModule, routingComponents } from './humanresource-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '@/Shared/shared.module';


@NgModule({
  declarations: [
    routingComponents,
  ],
  imports: [
    HumanresourceRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
  ]
})
export class HumanresourceModule { }
