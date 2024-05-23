import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProcessComponent } from './process/process.component';
import { ProcessCreateComponent } from './process-create/process-create.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: 'full',
    component: LoginComponent    
  },
  {
    path: "processes",
    component: ProcessComponent
  },
  {
    path: "processes/add",
    component: ProcessCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
