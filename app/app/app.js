"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_deprecated_1 = require("@angular/router-deprecated");
var http_1 = require("@angular/http");
var home_1 = require("../home/home");
var login_1 = require("../login/login");
var files_1 = require("../files/files");
var authHelper_1 = require("../authHelper/authHelper");
var profile_1 = require("../profile/profile");
var contacts_1 = require("../contacts/contacts");
var groups_1 = require("../groups/groups");
var mails_1 = require("../mails/mails");
var notes_1 = require("../notes/notes");
var tasks_1 = require("../tasks/tasks");
var trending_1 = require("../trending/trending");
var users_1 = require("../users/users");
var App = (function () {
    function App(http, router, auth) {
        var _this = this;
        this.http = http;
        this.http.get("http://localhost:3000/info")
            .map(function (res) { return res.json(); })
            .subscribe(function (info) {
            _this.nodeVersion = info.nodeVersion;
            _this.chromeVersion = info.chromeVersion;
            _this.electronVersion = info.electronVersion;
        });
        // route the user to a view based on presence of access token
        if (auth.isUserAuthenticated) {
            // access token exists...display the users files
            router.navigate(["/Home"]);
        }
        else {
            // access token doesn't exist, so the user needs to login
            router.navigate(["/Login"]);
        }
    }
    App.prototype.extractData = function (info) {
        this.nodeVersion = info.nodeVersion;
        this.chromeVersion = info.chromeVersion;
        this.electronVersion = info.electronVersion;
    };
    App = __decorate([
        core_1.Component({
            selector: "graph-app",
            templateUrl: __dirname + "/view-main.html",
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, profile_1.Profile]
        }),
        router_deprecated_1.RouteConfig([
            { name: "Default", path: "", redirectTo: ["Login"] },
            { name: "Home", component: home_1.Home, path: "/home" },
            { name: "Login", component: login_1.Login, path: "/login" },
            { name: "Files", component: files_1.Files, path: "/files" },
            { name: "Groups", component: groups_1.Groups, path: "/groups" },
            { name: "Contacts", component: contacts_1.Contacts, path: "/contacts" },
            { name: "Mails", component: mails_1.Mails, path: "/mails" },
            { name: "Notes", component: notes_1.Notes, path: "/notes" },
            { name: "Tasks", component: tasks_1.Tasks, path: "/tasks" },
            { name: "Trending", component: trending_1.Trending, path: "/trending" },
            { name: "Users", component: users_1.Users, path: "/users" },
        ]), 
        __metadata('design:paramtypes', [http_1.Http, router_deprecated_1.Router, authHelper_1.AuthHelper])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map