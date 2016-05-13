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
var profile_1 = require("../profile/profile");
var authHelper_1 = require("../authHelper/authHelper");
var Home = (function () {
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
exports.Home = Home;
//# sourceMappingURL=home.js.map