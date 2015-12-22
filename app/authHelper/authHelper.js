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
                    this.config = {
                        tenant: svcConsts_1.SvcConsts.TENTANT_ID,
                        clientId: svcConsts_1.SvcConsts.CLIENT_ID,
                        postLogoutRedirectUri: "http://localhost:8000",
                        redirectUri: "http://localhost:8000",
                        endpoints: {
                            officeGraph: svcConsts_1.SvcConsts.GRAPH_RESOURCE
                        },
                        cacheLocation: "localStorage",
                        displayCall: this.openAuth
                    };
                    this.handleLogInCallBack = function () {
                        var isCallback = _this.authContext.isCallback(window.location.hash);
                        _this.authContext.handleWindowCallback();
                        _this.currentUser = _this.authContext.getCachedUser();
                        var logError = -_this.authContext.getLoginError();
                        if (!!logError) {
                            alert(logError);
                        }
                        else if (isCallback && !logError) {
                            window.location = _this.authContext._getItem(_this.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
                        }
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
                    this.getRequestPromise = function (reqUrl) {
                        var p = new Promise(function (resolve, reject) {
                            var tokenPromise = _this.tokenPromise(_this.config.endpoints.officeGraph);
                            tokenPromise.then(function (token) {
                                var headers = new http_1.Headers();
                                headers.append("Authorization", "Bearer " + token);
                                _this.http.get(_this.config.endpoints.officeGraph + reqUrl, { headers: headers }).subscribe(function (res) {
                                    if (res.status === 200) {
                                        resolve(JSON.parse(res._body));
                                    }
                                    else {
                                        reject("An error occurred calling the Microsoft Graph.");
                                    }
                                });
                            });
                        });
                        return p;
                    };
                    this.http = http;
                    this.authContext = new AuthenticationContext(this.config);
                    this.handleLogInCallBack();
                }
                Object.defineProperty(AuthHelper.prototype, "isUserAuthenticated", {
                    get: function () {
                        return !!this.currentUser;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthHelper.prototype, "currentUserName", {
                    get: function () {
                        return this.isUserAuthenticated ? this.currentUser.profile.name : "";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthHelper.prototype, "userPropr", {
                    get: function () {
                        var userProps = new Array();
                        for (var property in this.currentUser.profile) {
                            if (this.currentUser.profile.hasOwnProperty(property)) {
                                userProps.push({ propertyName: property, value: this.currentUser.profile[property] });
                            }
                        }
                        return userProps;
                    },
                    enumerable: true,
                    configurable: true
                });
                AuthHelper.prototype.logIn = function () {
                    this.authContext.login();
                };
                AuthHelper.prototype.logOut = function () {
                    this.authContext.logOut();
                };
                AuthHelper.prototype.openAuth = function (authUrl) {
                    var authWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false
                        } });
                    authWindow.loadURL(authUrl);
                    authWindow.show();
                    authWindow.webContents.on("did-get-redirect-request", function (event, oldUrl, newUrl) {
                        console.log("ID Token - did-get-redirect-request: " + newUrl);
                        authWindow.destroy();
                        handleCallback(newUrl);
                    });
                    authWindow.on("close", function () {
                        authWindow = null;
                    });
                    function handleCallback(url) {
                        var authContextHelper = new AuthenticationContext(null);
                        var resultURL = new URL(url);
                        var requestInfo = authContextHelper.getRequestInfo(resultURL.hash);
                        if (requestInfo.parameters.id_token) {
                            window.localStorage.setItem("id_token", requestInfo.parameters.id_token);
                            authContextHelper.saveTokenFromHash(requestInfo);
                        }
                        else {
                            window.localStorage.removeItem("id_token");
                        }
                        remote.getCurrentWindow().reload();
                    }
                };
                AuthHelper.prototype.getAccessToken = function () {
                    var accessUrl = "https://login.microsoftonline.com/" + svcConsts_1.SvcConsts.TENTANT_ID +
                        "/oauth2/authorize?response_type=token&client_id=" + svcConsts_1.SvcConsts.CLIENT_ID +
                        "&resource=" + svcConsts_1.SvcConsts.GRAPH_RESOURCE +
                        "&redirect_uri=" + encodeURIComponent(this.config.redirectUri) +
                        "&prompt=none&state=SomeState&nonce=SomeNonce";
                    var accessWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        frame: true,
                        webPreferences: {
                            nodeIntegration: false
                        } });
                    accessWindow.webContents.on("did-get-redirect-request", function (event, oldUrl, newUrl) {
                        console.log("Access Token - did-get-redirect-request: " + newUrl);
                        accessWindow.destroy();
                        handleCallback(newUrl);
                    });
                    accessWindow.loadURL(accessUrl);
                    accessWindow.show();
                    function handleCallback(url) {
                        var authContextHelper = new AuthenticationContext(null);
                        var resultURL = new URL(url);
                        var requestInfo = authContextHelper.getRequestInfo(resultURL.hash);
                        if (requestInfo.parameters.access_token) {
                            window.localStorage.setItem("access_token", requestInfo.parameters.access_token);
                            authContextHelper.saveTokenFromHash(requestInfo);
                        }
                        else {
                            window.localStorage.removeItem("access_token");
                        }
                    }
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