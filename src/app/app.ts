import { Component, AfterViewInit } from "@angular/core";
import {
    Router,
    RouteConfig,
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS
} from "@angular/router-deprecated";

import { Home } from "../home/home";
import { Login } from "../login/login";
import { Files } from "../files/files";
import { AuthHelper } from "../authHelper/authHelper";
import { Profile } from "../profile/profile";
import { Contacts } from "../contacts/contacts";
import { Groups } from "../groups/groups";
import { Mails } from "../mails/mails";
import { Notes } from "../notes/notes";
import { Tasks } from "../tasks/tasks";
import { Trending } from "../trending/trending";
import { Users } from "../users/users";
import { ElectronService } from "../services/electronService";
import { InfoModel } from "../models/infoModel";
import { Toast } from "../toast/toast"

declare var componentHandler: any;

@Component({
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
    directives: [ROUTER_DIRECTIVES, Toast]
})

// configure the routes for the app
@RouteConfig([
    { name: "Default", path: "", redirectTo: ["Login"] },
    { name: "Home", component: Home, path: "/home" },
    { name: "Login", component: Login, path: "/login" },
    { name: "Files", component: Files, path: "/files" },
    { name: "Groups", component: Groups, path: "/groups" },
    { name: "Contacts", component: Contacts, path: "/contacts" },
    { name: "Mails", component: Mails, path: "/mails" },
    { name: "Notes", component: Notes, path: "/notes" },
    { name: "Tasks", component: Tasks, path: "/tasks" },
    { name: "Trending", component: Trending, path: "/trending" },
    { name: "Users", component: Users, path: "/users" }
])

export class App implements AfterViewInit  {
    userName: string = "";
    nodeVersion: string = "";
    chromeVersion: string = "";
    electronVersion: string = "";

    constructor(router: Router, auth: AuthHelper, electronService: ElectronService) {       
        electronService.GetInfo((info: InfoModel) => {
            this.nodeVersion = info.nodeVersion;
            this.chromeVersion = info.chromeVersion;
            this.electronVersion = info.electronVersion;
        })
        
        // route the user to a view based if the user is authenticated
        auth.isUserAuthenticated()
            .then(() => {
                router.navigate(["/Home"]);
            })
            .catch(() => {
                router.navigate(["/Login"]);
            });
    }

    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
}
