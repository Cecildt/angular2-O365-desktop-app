import { AuthenticationContext }  from "expose?AuthenticationContext!../../node_modules/modular-adal-angular/lib/adal.js";
import { SvcConsts } from "../svcConsts/svcConsts";
import { q } from "q";


export class AdalService {

    private authContext = null;
    private _oauthData = { isAuthenticated: false, userName: '', loginError: '', profile: '' };

    constructor() {
        let config = {
            tenant: SvcConsts.TENTANT_ID,
            clientId: SvcConsts.CLIENT_ID,
            postLogoutRedirectUri: SvcConsts.REDIRECT_URL,
            endpoints: {
                graphApiUri: "https://graph.microsoft.com",
                sharePointUri: "https://" + SvcConsts.TENTANT_NAME + ".sharepoint.com",
            }
            //cacheLocation: "localStorage" // enable this for IE, as sessionStorage does not work for localhost.
        };

        this.authContext = new AuthenticationContext(config);
    }

    public logIn() {
        var user = this.authContext.getCachedUser();
        if (!user) {
            this.authContext.login();
        }
    }

    public processAdalCallback() {
        // var hash = window.location.hash;

        // if (this.authContext.isCallback(hash)) {
        //     // callback can come from login or iframe request
        //     var requestInfo = this.authContext.getRequestInfo(hash);
        //     this.authContext.saveTokenFromHash(requestInfo);
        //     window.location.hash = '';

        //     if (requestInfo.requestType !== this.authContext.REQUEST_TYPE.LOGIN) {
        //         if (window.parent.AuthenticationContext === 'function' && window.parent.AuthenticationContext()) {
        //             this.authContext.callback = window.parent.AuthenticationContext().callback;
        //         }
        //         if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
        //             this.authContext.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
        //         }
        //     }

        //     if (requestInfo.stateMatch) {
        //         if (typeof this.authContext.callback === 'function') {
        //             // Call within the same context without full page redirect keeps the callback
        //             if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
        //                 // Idtoken or Accestoken can be renewed
        //                 if (requestInfo.parameters['access_token']) {
        //                     this.authContext.callback(this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
        //                     return;
        //                 } else if (requestInfo.parameters['id_token']) {
        //                     this.authContext.callback(this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
        //                     return;
        //                 }
        //             }
        //         } else {
        //             // normal full login redirect happened on the page
        //             this.updateDataFromCache(this.authContext.config.loginResource);
        //             if (this._oauthData.userName) {
        //                 //IDtoken is added as token for the app
        //                 window.setTimeout(function () {
        //                     this.updateDataFromCache(this.authContext.config.loginResource);
        //                     // redirect to login requested page
        //                     var loginStartPage = this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.START_PAGE);
        //                     if (loginStartPage) {
        //                         window.location.path(loginStartPage);
        //                     }
        //                 }, 1);
        //             }
        //         }
        //     }
        // }
    }

    public isAuthenticated() {
        var deferred = q.defer();

        this.updateDataFromCache(this.authContext.config.loginResource);
        if (!this.authContext._renewActive && !this._oauthData.isAuthenticated && !this._oauthData.userName) {
            if (!this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.FAILED_RENEW)) {
                // Idtoken is expired or not present
                this.authContext.acquireToken(this.authContext.config.loginResource, function (error, tokenOut) {
                    if (error) {
                        this.authContext.error('adal:loginFailure', 'auto renew failure');
                        deferred.reject();
                    }
                    else {
                        if (tokenOut) {
                            this._oauthData.isAuthenticated = true;
                            deferred.resolve();
                        }
                        else {
                            deferred.reject();
                        }
                    }
                });
            }
            else {
                deferred.resolve();
            }
        }
        else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    public adalRequest(settings) {
        var deferred = q.defer();

        this.isAuthenticated().then(function () {
            var resource = this.authContext.getResourceForEndpoint(settings.url);

            if (!resource) {
                this.authContext.info('No resource configured for \'' + settings.url + '\'');
                deferred.reject();
                return deferred.promise;
            }

            var tokenStored = this.authContext.getCachedToken(resource);
            if (tokenStored) {
                if (!settings.headers) {
                    settings.headers = {};
                }

                settings.headers.Authorization = 'Bearer ' + tokenStored;

                this.makeRequest(settings).then(deferred.resolve, deferred.reject);
            }
            else {
                var isEndpoint = false;

                for (var endpointUrl in this.authContext.config.endpoints) {
                    if (settings.url.indexOf(endpointUrl) > -1) {
                        isEndpoint = true;
                    }
                }

                if (this.authContext.loginInProgress()) {
                    this.authContext.info('Login already in progress');
                    deferred.reject();
                }
                else if (isEndpoint) {
                    this.authContext.acquireToken(resource, function (error, tokenOut) {
                        if (error) {
                            deferred.reject();
                            this.authContext.error(error);
                        }
                        else {
                            if (tokenOut) {
                                this.authContext.verbose('Token is available');
                                if (!settings.headers) {
                                    settings.headers = {};
                                }
                                settings.headers.Authorization = 'Bearer ' + tokenOut;
                                this.makeRequest(settings).then(deferred.resolve, deferred.reject);
                            }
                        }
                    });
                }
            }
        }, function () {
            this.authContext.login();
        })

        return deferred.promise;
    }

    private makeRequest(settings: any) {
        var deferred = q.defer();

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    deferred.resolve(this.response);
                }
                else if (this.status >= 400) {
                    deferred.reject();
                }
            }
        }
        xhr.open(settings.method || 'GET', settings.url, true);

        for (var header in settings.headers) {
            xhr.setRequestHeader(header, settings.headers[header]);
        }

        xhr.responseType = settings.dataType || 'json';
        xhr.send(settings.data);

        return deferred.promise;
    }

    private updateDataFromCache(resource) {
        // only cache lookup here to not interrupt with events
        var token = this.authContext.getCachedToken(resource);
        this._oauthData.isAuthenticated = token !== null && token.length > 0;
        var user = this.authContext.getCachedUser() || { userName: '' };
        this._oauthData.userName = user.userName;
        this._oauthData.profile = user.profile;
        this._oauthData.loginError = this.authContext.getLoginError();
    }
}