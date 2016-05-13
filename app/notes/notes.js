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
var Notes = (function () {
    function Notes(authHelper) {
        var _this = this;
        this.books = [];
        authHelper.getRequestPromise("/beta/me/notes/notebooks").then(function (data) {
            if (data) {
                _this.books = data.value;
            }
            else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
    Notes = __decorate([
        core_1.Component({
            selector: "my-notes",
            templateUrl: "./notes/view-notes.html",
        }), 
        __metadata('design:paramtypes', [authHelper_1.AuthHelper])
    ], Notes);
    return Notes;
}());
exports.Notes = Notes;
//# sourceMappingURL=notes.js.map