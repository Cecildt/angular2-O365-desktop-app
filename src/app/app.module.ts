import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { APP_ROUTING } from '../routes/app.routes';
import { AppComponent } from '../app/app'
import { AuthHelper } from "../authHelper/authHelper";
import { Profile } from "../profile/profile";
import { ElectronService } from "../services/electronService";
import { Toast } from "../toast/toast"


@NgModule({
  imports:      [ BrowserModule, APP_ROUTING ],
  declarations: [ AppComponent, AuthHelper, Profile, ElectronService, Toast ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
