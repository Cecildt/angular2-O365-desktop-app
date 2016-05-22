import { provide } from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic'
import { ROUTER_PROVIDERS } from "@angular/router-deprecated";
import { HTTP_PROVIDERS } from "@angular/http";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import "rxjs";

import { App } from '../app/app'
import { AuthHelper } from "../authHelper/authHelper";
import { Profile } from "../profile/profile";

bootstrap(App, [AuthHelper, Profile, HTTP_PROVIDERS, ROUTER_PROVIDERS, { provide: LocationStrategy, useClass: HashLocationStrategy }]);