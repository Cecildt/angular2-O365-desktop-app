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
var authHelper_1 = require("../authHelper/authHelper");
var Profile = (function () {
    function Profile(authHelper) {
        this.displayName = "";
        this.photo = "";
        this.authHelper = authHelper;
        this.refreshInfo();
    }
    Profile.prototype.refreshInfo = function () {
        var _this = this;
        this.authHelper.getRequestPromise("/v1.0/me/").then(function (data) {
            if (data) {
                _this.displayName = data.displayName;
            }
            else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
        this.authHelper.getPhotoRequestPromise("/v1.0/me/photo/$value").then(function (data) {
            if (data) {
                _this.photo = data;
            }
            else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    };
    Profile = __decorate([
        core_1.Component({
            selector: "my-profile",
            template: "<img src='{{photo}}' width='80' height='80' /><h5>Welcome {{displayName}}</h5>",
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [authHelper_1.AuthHelper])
    ], Profile);
    return Profile;
}());
exports.Profile = Profile;
//# sourceMappingURL=profile.js.map