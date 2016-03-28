import { provide } from 'angular2/core';
import { bootstrap }    from 'angular2/platform/browser'
import { ROUTER_PROVIDERS, APP_BASE_HREF } from "angular2/router";
import { HTTP_PROVIDERS } from "angular2/http";
import "rxjs/Rx";

import { App } from '../app/app'
import { AuthHelper } from "../authHelper/authHelper";
import { Profile } from "../profile/profile";

bootstrap(App, [AuthHelper, Profile, HTTP_PROVIDERS, ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue : '/'})]);