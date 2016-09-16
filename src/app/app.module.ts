import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { APP_ROUTING } from '../routes/app.routes';
import { AppComponent } from '../app/app.component'
import { AuthService } from "../auth/auth.service";
import { ProfileComponent } from "../profile/profile.component";
import { ElectronService } from "../services/electron.service";
import { ToastComponent } from "../toast/toast.component"


@NgModule({
  imports:      [ BrowserModule, HttpModule, APP_ROUTING ],
  declarations: [ AppComponent, AuthService, ProfileComponent, ElectronService, ToastComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
