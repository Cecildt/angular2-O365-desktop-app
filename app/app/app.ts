import { Component, bind } from "angular2/core";
import { bootstrap } from "angular2/platform/browser";
import {
Router,
RouteConfig,
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
LocationStrategy,
HashLocationStrategy
} from "angular2/router";
import { HTTP_PROVIDERS } from "angular2/http";

import { Login } from "../login/login";
import { Files } from "../files/files";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "files-app",
    template: "<strong>{{userName}}</strong><router-outlet></router-outlet>",
    directives: [ROUTER_DIRECTIVES]
})

// configure the routes for the app
@RouteConfig([
    { name: "Default", path: "", redirectTo: ["Login"] },
    { name: "Login", component: Login, path: "/login" },
    { name: "Files", component: Files, path: "/files" }
])

export class App {
    userName: string;

    constructor(router: Router, auth: AuthHelper) {
        // route the user to a view based on presence of access token
        if (auth.isUserAuthenticated) {
            // access token exists...display the users files
            //this.userName = "Welcome " + auth.currentUserName;
            router.navigate(["/Files"]);
        } else {
            // access token doesn't exist, so the user needs to login
            router.navigate(["/Login"]);
        }
    }
}

bootstrap(App, [AuthHelper, HTTP_PROVIDERS, ROUTER_PROVIDERS, bind(LocationStrategy).toClass(HashLocationStrategy)]);