var q = require('q');
var AuthenticationContext = require('modular-adal-angular/lib/adal.js');
var adalConfig = require('./adal-config');

var _adal = new AuthenticationContext(adalConfig);
var _oauthData = { isAuthenticated: false, userName: '', loginError: '', profile: '' };

var login = function () {
    var user = _adal.getCachedUser();
    if (!user) {
        _adal.login();
    }
}

var getToken = function () {
    _adal.acquireToken(_adal.config.loginResource, function (error, tokenOut) {
        if (error) {
            console.log(error)
        }
        else {
            if (tokenOut) {
                console.log(tokenOut);
            }
            else {
                console.log("No token");
            }
        }
    });
}

var processAdalCallback = function () {
    var hash = window.location.hash;

    if (_adal.isCallback(hash)) {
        // callback can come from login or iframe request
        var requestInfo = _adal.getRequestInfo(hash);
        _adal.saveTokenFromHash(requestInfo);
        window.location.hash = '';

        if (requestInfo.requestType !== _adal.REQUEST_TYPE.LOGIN) {
            if (window.parent.AuthenticationContext === 'function' && window.parent.AuthenticationContext()) {
                _adal.callback = window.parent.AuthenticationContext().callback;
            }
            if (requestInfo.requestType === _adal.REQUEST_TYPE.RENEW_TOKEN) {
                _adal.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }
        }

        if (requestInfo.stateMatch) {
            if (typeof _adal.callback === 'function') {
                // Call within the same context without full page redirect keeps the callback
                if (requestInfo.requestType === _adal.REQUEST_TYPE.RENEW_TOKEN) {
                    // Idtoken or Accestoken can be renewed
                    if (requestInfo.parameters['access_token']) {
                        _adal.callback(_adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
                        return;
                    } else if (requestInfo.parameters['id_token']) {
                        _adal.callback(_adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
                        return;
                    }
                }
            } else {
                // normal full login redirect happened on the page
                updateDataFromCache(_adal.config.loginResource);
                if (_oauthData.userName) {
                    //IDtoken is added as token for the app
                    window.setTimeout(function () {
                        updateDataFromCache(_adal.config.loginResource);
                        // redirect to login requested page
                        var loginStartPage = _adal._getItem(_adal.CONSTANTS.STORAGE.START_PAGE);
                        if (loginStartPage) {
                            window.location.path(loginStartPage);
                        }
                    }, 1);
                }
            }
        }
    }
}

var updateDataFromCache = function (resource) {
    // only cache lookup here to not interrupt with events
    var token = _adal.getCachedToken(resource);
    _oauthData.isAuthenticated = token !== null && token.length > 0;
    var user = _adal.getCachedUser() || { userName: '' };
    _oauthData.userName = user.userName;
    _oauthData.profile = user.profile;
    _oauthData.loginError = _adal.getLoginError();
};

var isAuthenticated = function () {
    var deferred = q.defer();

    updateDataFromCache(_adal.config.loginResource);
    if (!_adal._renewActive && !_oauthData.isAuthenticated && !_oauthData.userName) {
        if (!_adal._getItem(_adal.CONSTANTS.STORAGE.FAILED_RENEW)) {
            // Idtoken is expired or not present
            _adal.acquireToken(_adal.config.loginResource, function (error, tokenOut) {
                if (error) {
                    _adal.error('adal:loginFailure', 'auto renew failure');
                    deferred.reject();
                }
                else {
                    if (tokenOut) {
                        _oauthData.isAuthenticated = true;
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

var makeRequest = function (settings) {
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

var adalRequest = function (settings) {
    var deferred = q.defer();

    isAuthenticated().then(function () {
        var resource = _adal.getResourceForEndpoint(settings.url);

        if (!resource) {
            _adal.info('No resource configured for \'' + settings.url + '\'');
            deferred.reject();
            return deferred.promise;
        }

        var tokenStored = _adal.getCachedToken(resource);
        if (tokenStored) {
            if (!settings.headers) {
                settings.headers = {};
            }

            settings.headers.Authorization = 'Bearer ' + tokenStored;

            makeRequest(settings).then(deferred.resolve, deferred.reject);
        }
        else {
            var isEndpoint = false;

            for (var endpointUrl in _adal.config.endpoints) {
                if (settings.url.indexOf(endpointUrl) > -1) {
                    isEndpoint = true;
                }
            }

            if (_adal.loginInProgress()) {
                _adal.info('Login already in progress');
                deferred.reject();
            }
            else if (isEndpoint) {
                _adal.acquireToken(resource, function (error, tokenOut) {
                    if (error) {
                        deferred.reject();
                        _adal.error(error);
                    }
                    else {
                        if (tokenOut) {
                            _adal.verbose('Token is available');
                            if (!settings.headers) {
                                settings.headers = {};
                            }
                            settings.headers.Authorization = 'Bearer ' + tokenOut;
                            makeRequest(settings).then(deferred.resolve, deferred.reject);
                        }
                    }
                });
            }
        }
    }, function () {
        _adal.login();
    })

    return deferred.promise;
}

module.exports = {
    adalRequest: adalRequest,
    processAdalCallback: processAdalCallback,
    login: login
}