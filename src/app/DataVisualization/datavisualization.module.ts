import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatavisualizationRoutingModule, routingComponents } from './datavisualization-routing.module';
import { LineChartNewComponent } from './line-chart-new/line-chart-new.component';


@NgModule({
  declarations: [
    routingComponents,
    LineChartNewComponent,
  ],
  imports: [
    CommonModule,
    DatavisualizationRoutingModule
  ]
})
export class DatavisualizationModule { }
