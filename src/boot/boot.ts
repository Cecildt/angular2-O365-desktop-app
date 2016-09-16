import { bootstrap }    from '@angular/platform-browser-dynamic'
import { HTTP_PROVIDERS } from "@angular/http";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import "rxjs";

import { APP_ROUTER_PROVIDER } from '../routes/app.routes';

import { App } from '../app/app'
import { AuthHelper } from "../authHelper/authHelper";
import { Profile } from "../profile/profile";
import { ElectronService } from "../services/electronService";
import { Toast } from "../toast/toast"

bootstrap(App, [AuthHelper, ElectronService, Profile, Toast, HTTP_PROVIDERS, APP_ROUTER_PROVIDER);