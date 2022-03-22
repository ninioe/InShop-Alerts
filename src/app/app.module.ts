import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertsComponent } from './alerts/alerts.component';
import { authInterseptorService } from './_services/auth-interseptor.service';
import { TimeAgoPipe2 } from './_pipes/time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertsComponent,
    TimeAgoPipe2
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [authInterseptorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
