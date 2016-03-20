System.register(["angular2/core", "../profile/profile", "../authHelper/authHelper"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, profile_1, authHelper_1;
    var Home;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (profile_1_1) {
                profile_1 = profile_1_1;
            },
            function (authHelper_1_1) {
                authHelper_1 = authHelper_1_1;
            }],
        execute: function() {
            Home = (function () {
                function Home(auth, profile) {
                    this.authHelper = auth;
                    this.profile = profile;
                }
                Home.prototype.signOut = function () {
                    this.authHelper.logOut();
                };
                Home.prototype.refreshInfo = function () {
                    this.profile.refreshInfo();
                };
                Home = __decorate([
                    core_1.Component({
                        selector: "my-home",
                        templateUrl: "./home/view-home.html",
                        directives: [profile_1.Profile]
                    }), 
                    __metadata('design:paramtypes', [authHelper_1.AuthHelper, profile_1.Profile])
                ], Home);
                return Home;
            }());
            exports_1("Home", Home);
        }
    }
});
//# sourceMappingURL=home.js.map