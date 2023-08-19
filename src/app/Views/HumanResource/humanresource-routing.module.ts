import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmplistComponent } from './EmpList/emplist.component';
import { ResumeComponent } from './Resume/resume.component';

const routes: Routes = [
  {
    path: '', data: { title: 'Resume Component' },
    children: [
      {
        path: '', redirectTo: 'Resume', pathMatch: 'full'
      },
      {
        path: 'Resume', component: ResumeComponent,
        data: { title: 'Resume Component' }
      },
      {
        path: 'Emplist', component: EmplistComponent,
        data: { title: 'Employee List Component' }
      },
      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanresourceRoutingModule { }

export const routingComponents = [
  ResumeComponent,
  EmplistComponent
  
];