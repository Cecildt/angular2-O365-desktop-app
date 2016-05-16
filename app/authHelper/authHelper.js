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
var http_1 = require("@angular/http");
var svcConsts_1 = require("../svcConsts/svcConsts");
var AuthHelper = (function () {
    function AuthHelper(http) {
        var _this = this;
        this.access_token = null;
        this.getRequestPromise = function (reqUrl) {
            var p = new Promise(function (resolve, reject) {
                var tokenPromise = _this.tokenPromise(svcConsts_1.SvcConsts.GRAPH_RESOURCE);
                tokenPromise.then(function (token) {
                    var headers = new http_1.Headers();
                    headers.append("Authorization", "Bearer " + token);
                    _this.http.get(svcConsts_1.SvcConsts.GRAPH_RESOURCE + reqUrl, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
                });
            });
            return p;
        };
        this.getPhotoRequestPromise = function (reqUrl) {
            var p = new Promise(function (resolve, reject) {
                var tokenPromise = _this.tokenPromise(svcConsts_1.SvcConsts.GRAPH_RESOURCE);
                tokenPromise.then(function (token) {
                    var request = new XMLHttpRequest;
                    request.open("GET", svcConsts_1.SvcConsts.GRAPH_RESOURCE + reqUrl);
                    request.setRequestHeader("Authorization", "Bearer " + token);
                    request.responseType = "blob";
                    request.onload = function () {
                        if (request.readyState === 4 && request.status === 200) {
                            var reader_1 = new FileReader();
                            reader_1.onload = function () {
                                resolve(reader_1.result);
                            };
                            reader_1.readAsDataURL(request.response);
                        }
                        else {
                            reject("An error occurred calling the Microsoft Graph.");
                        }
                    };
                    request.send(null);
                });
            });
            return p;
        };
        this.tokenPromise = function (endpoint) {
            var p = new Promise(function (resolve, reject) {
                var token = window.localStorage.getItem("access_token");
                if (token && token !== "undefined") {
                    resolve(token);
                }
                else {
                    _this.getAccessToken();
                    reject();
                }
            });
            return p;
        };
        this.http = http;
        this.http.get("http://localhost:3000/token")
            .map(function (res) { return res.json(); })
            .subscribe(function (token) {
            _this.access_token = token;
            window.localStorage.setItem("access_token", token);
        });
    }
    Object.defineProperty(AuthHelper.prototype, "isUserAuthenticated", {
        get: function () {
            var token = window.localStorage.getItem("access_token");
            return token != null;
        },
        enumerable: true,
        configurable: true
    });
    AuthHelper.prototype.logIn = function () {
        //redirect to get access_token
        window.location.href = "https://login.microsoftonline.com/" + svcConsts_1.SvcConsts.TENTANT_ID +
            "/oauth2/authorize?response_type=id_token&client_id=" + svcConsts_1.SvcConsts.CLIENT_ID +
            "&redirect_uri=" + encodeURIComponent(svcConsts_1.SvcConsts.REDIRECT_URL) +
            "&state=SomeState&nonce=SomeNonce";
    };
    AuthHelper.prototype.logOut = function () {
        // TODO
    };
    AuthHelper.prototype.getAccessToken = function () {
        //redirect to get access_token
        window.location.href = "https://login.microsoftonline.com/" + svcConsts_1.SvcConsts.TENTANT_ID +
            "/oauth2/authorize?response_type=token&client_id=" + svcConsts_1.SvcConsts.CLIENT_ID +
            "&resource=" + svcConsts_1.SvcConsts.GRAPH_RESOURCE +
            "&redirect_uri=" + encodeURIComponent(svcConsts_1.SvcConsts.REDIRECT_URL) +
            "&prompt=none&state=SomeState&nonce=SomeNonce";
    };
    AuthHelper.prototype.parseQueryString = function (url) {
        var params = {}, queryString = url.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    };
    AuthHelper = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthHelper);
    return AuthHelper;
}());
exports.AuthHelper = AuthHelper;
//# sourceMappingURL=authHelper.js.map