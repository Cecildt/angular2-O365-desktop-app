"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var router_deprecated_1 = require("@angular/router-deprecated");
var http_1 = require("@angular/http");
var common_1 = require('@angular/common');
require("rxjs/Rx");
var app_1 = require('../app/app');
var authHelper_1 = require("../authHelper/authHelper");
var profile_1 = require("../profile/profile");
platform_browser_dynamic_1.bootstrap(app_1.App, [authHelper_1.AuthHelper, profile_1.Profile, http_1.HTTP_PROVIDERS, router_deprecated_1.ROUTER_PROVIDERS, core_1.provide(common_1.APP_BASE_HREF, { useValue: '/' })]);
//# sourceMappingURL=boot.js.map