System.register(['angular2/core', 'angular2/platform/browser', "angular2/router", "angular2/http", "rxjs/Rx", '../app/app', "../authHelper/authHelper", "../profile/profile"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, browser_1, router_1, http_1, app_1, authHelper_1, profile_1;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (authHelper_1_1) {
                authHelper_1 = authHelper_1_1;
            },
            function (profile_1_1) {
                profile_1 = profile_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.App, [authHelper_1.AuthHelper, profile_1.Profile, http_1.HTTP_PROVIDERS, router_1.ROUTER_PROVIDERS, core_1.provide(router_1.APP_BASE_HREF, { useValue: '/' })]);
        }
    }
});
//# sourceMappingURL=boot.js.map