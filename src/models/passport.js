var AzureOAuthStrategy = require('passport-azure-oauth').Strategy;
var User = require('./user.js');
var appSettings = require('./appSettings.js');

module.exports = function (passport) {
    // used to serialize the user for the session
    passport.serializeUser(function (user, next) {
        next(null, user);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function (id, next) {
        User.findById(id, function (err, user) {
            next(err, user);
        });
    });
    
    // For information on the profile entries: see http://msdn.microsoft.com/en-us/library/azure/dn645542.aspx
    passport.use('azureoauth', new AzureOAuthStrategy(
        appSettings.oauthOptions,
        function Verify(accessToken, refreshToken, params, profile, next) {
            User.validate({
                'accessToken': accessToken,
                'refreshToken': refreshToken,
                'tokenParams': params,
                'userProfile': profile
            },
                function (err, user) {
                    passport.user = null;
                    if (err)
                        return next(err);
                    if (!user)
                        return next('Cannot verify the user ' + profile.displayname + ', ' + profile.username);
                    // all is well, return successful user
                    passport.user = user;
                    return next(null, user);
                });
        })
    );
    
    passport.getAccessToken = function (resource, req, res, next) {
        if (passport.user.hasToken(resource)) {
            // already has access token for the exchange service,
            // should also check for expiration, and other issues, ignore for now.
            // skip to the next middleware
            return next();
        } else {
            var data = 'grant_type=refresh_token'
                + '&refresh_token=' + passport.user.refresh_token
                + '&client_id=' + appSettings.oauthOptions.clientId
                + '&client_secret=' + encodeURIComponent(appSettings.oauthOptions.clientSecret)
                + '&resource=' + encodeURIComponent(resource);
            var opts = {
                url: appSettings.apiEndpoints.accessTokenRequestUrl,
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            require('request').post(opts, function (err, response, body) {
                if (err) {
                    return next(err)
                } else {
                    var token = JSON.parse(body);
                    passport.user.setToken(token);
                    return next();
                }
            })
        }
    }
};