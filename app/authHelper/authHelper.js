System.register(["angular2/core", "angular2/http", "../svcConsts/svcConsts"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, svcConsts_1;
    var electron, remote, BrowserWindow, AuthHelper;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (svcConsts_1_1) {
                svcConsts_1 = svcConsts_1_1;
            }],
        execute: function() {
            electron = require("electron");
            remote = electron.remote;
            BrowserWindow = remote.BrowserWindow;
            AuthHelper = (function () {
                function AuthHelper(http) {
                    var _this = this;
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
                                        var reader = new FileReader();
                                        reader.onload = function () {
                                            resolve(reader.result);
                                        };
                                        reader.readAsDataURL(request.response);
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
                    var id_token = window.localStorage.getItem("id_token");
                    if (id_token != null) {
                        this.getAccessToken();
                    }
                }
                Object.defineProperty(AuthHelper.prototype, "isUserAuthenticated", {
                    get: function () {
                        var id_token = window.localStorage.getItem("id_token");
                        return id_token != null;
                    },
                    enumerable: true,
                    configurable: true
                });
                AuthHelper.prototype.logIn = function () {
                    var loginUrl = "https://login.microsoftonline.com/" + svcConsts_1.SvcConsts.TENTANT_ID +
                        "/oauth2/authorize?response_type=id_token&client_id=" + svcConsts_1.SvcConsts.CLIENT_ID +
                        "&redirect_uri=" + encodeURIComponent(svcConsts_1.SvcConsts.REDIRECT_URL) +
                        "&state=SomeState&nonce=SomeNonce";
                    this.openAuth(loginUrl);
                };
                AuthHelper.prototype.openAuth = function (authUrl) {
                    var _this = this;
                    var authWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false
                        } });
                    authWindow.webContents.on("did-get-redirect-request", function (event, oldUrl, newUrl) {
                        authWindow.destroy();
                        var tokenURL = new URL(newUrl);
                        var params = _this.parseQueryString(tokenURL.hash);
                        if (params.id_token != null) {
                            window.localStorage.setItem("id_token", params.id_token);
                        }
                        else {
                            window.localStorage.removeItem("id_token");
                        }
                        remote.getCurrentWindow().reload();
                    });
                    authWindow.on("close", function () {
                        authWindow = null;
                    });
                    authWindow.loadURL(authUrl);
                    authWindow.show();
                };
                AuthHelper.prototype.getAccessToken = function () {
                    var _this = this;
                    var id_token = window.localStorage.getItem("id_token");
                    if (!id_token) {
                        return;
                    }
                    var accessUrl = "https://login.microsoftonline.com/" + svcConsts_1.SvcConsts.TENTANT_ID +
                        "/oauth2/authorize?response_type=token&client_id=" + svcConsts_1.SvcConsts.CLIENT_ID +
                        "&resource=" + svcConsts_1.SvcConsts.GRAPH_RESOURCE +
                        "&redirect_uri=" + encodeURIComponent(svcConsts_1.SvcConsts.REDIRECT_URL) +
                        "&prompt=none&state=SomeState&nonce=SomeNonce";
                    var accessWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false
                        } });
                    accessWindow.webContents.on("did-get-redirect-request", function (event, oldUrl, newUrl) {
                        accessWindow.destroy();
                        var tokenURL = new URL(newUrl);
                        var params = _this.parseQueryString(tokenURL.hash);
                        if (params.access_token != null) {
                            window.localStorage.setItem("access_token", params.access_token);
                        }
                        else {
                            window.localStorage.removeItem("access_token");
                        }
                    });
                    accessWindow.on("close", function () {
                        accessWindow = null;
                    });
                    accessWindow.loadURL(accessUrl);
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
            })();
            exports_1("AuthHelper", AuthHelper);
        }
    }
});
//# sourceMappingURL=authHelper.js.map