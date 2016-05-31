var q = require('q');
var AuthenticationContext = require('modular-adal-angular/lib/adal.js');
var adalConfig = require('./adal-config');

var _adal = new AuthenticationContext(adalConfig);
var _oauthData = { isAuthenticated: false, userName: '', loginError: '', profile: '' };

var login = function () {
    let user = _adal.getCachedUser();
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

var updateDataFromCache = function (resource) {
    // only cache lookup here to not interrupt with events
    var token = _adal.getCachedToken(resource);
    _oauthData.isAuthenticated = token !== null && token.length > 0;
    var user = _adal.getCachedUser() || { userName: '' };
    _oauthData.userName = user.userName;
    _oauthData.profile = user.profile;
    _oauthData.loginError = _adal.getLoginError();
};

var isAuthenticated = function (callback) {
    var hash = localStorage.getItem("loginHash");

    if (_adal.isCallback(hash)) {
        let requestInfo = _adal.getRequestInfo(hash);

        if (requestInfo.valid) {
            _adal.saveTokenFromHash(requestInfo);
            
            _adal.getUser(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(user);

                    _adal.acquireToken(adalConfig.endpoints.graphApiUri, function (error, token) {
                        if (error || !token) {
                            console.log("ADAL error occurred: " + error);
                            callback(error, false)
                        }
                        else {
                            callback(null, true);
                        }
                    });
                }
            });
        }
    }


}

module.exports = {
    login: login,
    isAuthenticated: isAuthenticated
}