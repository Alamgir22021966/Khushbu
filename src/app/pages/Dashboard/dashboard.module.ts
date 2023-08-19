import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule, routingComponents } from './dashboard-routing.module';


@NgModule({
  declarations: [
    routingComponents
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    
  ],
  providers: [
    // DashboardService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
   ],
})
export class DashboardModule { }
