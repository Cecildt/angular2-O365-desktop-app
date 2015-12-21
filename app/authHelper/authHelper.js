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
    var AuthHelper;
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
            AuthHelper = (function () {
                function AuthHelper(http) {
                    var _this = this;
                    this.config = {
                        tenant: svcConsts_1.SvcConsts.TENTANT_ID,
                        clientId: svcConsts_1.SvcConsts.CLIENT_ID,
                        postLogoutRedirectUri: window.location.origin,
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
                            _this.authContext.acquireToken(endpoint, function (error, token) {
                                if (error || !token) {
                                    alert("ADAL error occurred: " + error);
                                    return;
                                }
                                else {
                                    resolve(token);
                                }
                            }).fail(function () {
                                console.log("fetching files from onedrive failed.");
                                alert("something went wrong! try refreshing the page.");
                            });
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
                                    resolve(JSON.parse(res._body));
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
                    var authWindow = new GitHubElectron.BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        node: -integration, false:  });
                    authWindow.loadUrl(authUrl);
                    authWindow.show();
                    authWindow.webContents.on('will-navigate', function (event, url) {
                        console.log("will-navigate: " + url);
                        authWindow.destroy();
                    });
                    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
                        console.log("did-get-redirect-request: " + newUrl);
                        authWindow.destroy();
                    });
                    authWindow.on('close', function () {
                        authWindow = null;
                    }, false);
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