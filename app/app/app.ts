import { Component } from "@angular/core";
import {
Router,
RouteConfig,
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS
} from "@angular/router-deprecated";
import { Http, Headers, Response } from "@angular/http";


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

@Component({
    selector: "graph-app",
    templateUrl: __dirname + "/view-main.html",
    directives: [ROUTER_DIRECTIVES, Profile]
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
    { name: "Users", component: Users, path: "/users" },
])

export class App {
    http: Http;
    userName: string;
    nodeVersion: string;
    chromeVersion: string;
    electronVersion: string;

    constructor(http: Http, router: Router, auth: AuthHelper) {
        this.http = http;
        this.http.get("http://localhost:3000/info")
                        .map((res: any) => res.json())
                        .subscribe(info => {
                            this.nodeVersion = info.nodeVersion;
                            this.chromeVersion = info.chromeVersion;
                            this.electronVersion = info.electronVersion;    
                        })
                
        // route the user to a view based on presence of access token
        if (auth.isUserAuthenticated) {
            // access token exists...display the users files
            router.navigate(["/Home"]);
        } else {
            // access token doesn't exist, so the user needs to login
            router.navigate(["/Login"]);
        }
    }
    
    private extractData(info: any) {
        
        this.nodeVersion = info.nodeVersion;
        this.chromeVersion = info.chromeVersion;
        this.electronVersion = info.electronVersion;
    }
}
