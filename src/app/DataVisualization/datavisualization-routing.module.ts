import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LineChartComponent} from './line-chart/line-chart.component';
import {StackedChartComponent} from './stacked-chart/stacked-chart.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Payment Gateway Component' },
    children: [
      {
        path: '', redirectTo: 'PaymentGateway', pathMatch: 'full'
      },
      {
        path: 'LineChart', component: LineChartComponent,
        data: { title: 'Line Chart Component' }
      },
      {
        path: 'StackedChart', component: StackedChartComponent,
        data: { title: 'Stacked Bar Chart Component' }
      },
      

    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatavisualizationRoutingModule {}

export const routingComponents = [
  LineChartComponent, 
  StackedChartComponent,
];
