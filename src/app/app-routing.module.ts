import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertsComponent } from './alerts/alerts.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'alerts', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
