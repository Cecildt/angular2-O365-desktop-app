System.register(["angular2/core", "angular2/platform/browser", "angular2/router", "angular2/http", "rxjs/Rx", "../login/login", "../files/files", "../authHelper/authHelper", "../profile/profile", "../contacts/contacts", "../groups/groups", "../mails/mails", "../notes/notes", "../tasks/tasks", "../trending/trending", "../users/users"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, browser_1, router_1, http_1, login_1, files_1, authHelper_1, profile_1, contacts_1, groups_1, mails_1, notes_1, tasks_1, trending_1, users_1;
    var App;
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
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (files_1_1) {
                files_1 = files_1_1;
            },
            function (authHelper_1_1) {
                authHelper_1 = authHelper_1_1;
            },
            function (profile_1_1) {
                profile_1 = profile_1_1;
            },
            function (contacts_1_1) {
                contacts_1 = contacts_1_1;
            },
            function (groups_1_1) {
                groups_1 = groups_1_1;
            },
            function (mails_1_1) {
                mails_1 = mails_1_1;
            },
            function (notes_1_1) {
                notes_1 = notes_1_1;
            },
            function (tasks_1_1) {
                tasks_1 = tasks_1_1;
            },
            function (trending_1_1) {
                trending_1 = trending_1_1;
            },
            function (users_1_1) {
                users_1 = users_1_1;
            }],
        execute: function() {
            App = (function () {
                function App(router, auth) {
                    if (auth.isUserAuthenticated) {
                        router.navigate(["/Files"]);
                    }
                    else {
                        router.navigate(["/Login"]);
                    }
                }
                App = __decorate([
                    core_1.Component({
                        selector: "graph-app",
                        templateUrl: "./app/view-main.html",
                        directives: [router_1.ROUTER_DIRECTIVES, profile_1.Profile]
                    }),
                    router_1.RouteConfig([
                        { name: "Default", path: "", redirectTo: ["Login"] },
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
                    __metadata('design:paramtypes', [router_1.Router, authHelper_1.AuthHelper])
                ], App);
                return App;
            })();
            exports_1("App", App);
            browser_1.bootstrap(App, [authHelper_1.AuthHelper, http_1.HTTP_PROVIDERS, router_1.ROUTER_PROVIDERS, core_1.bind(router_1.LocationStrategy).toClass(router_1.HashLocationStrategy)]);
        }
    }
});
//# sourceMappingURL=app.js.map