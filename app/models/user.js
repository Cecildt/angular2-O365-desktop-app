(function (user) {
    user.tokens = {};
    user.refresh_token = "";
    user.username = "";
    user.displayName = "";
    user.capabilities = {};
    user.validate = function (result, next) {
        if (!result) {
            return next('invalid user');
        } else if (!result.accessToken) {
            return next('invalid credentials');
        } else {
            user.displayname = result.userProfile.displayname;
            user.username = result.userProfile.username;
            user.accessToken = result.accessToken;
            user.refresh_token = result.refreshToken;
            result.tokenParams.refresh_token = result.refreshToken;
            user.setToken(result.tokenParams);
            return next(null, user);
        }
    };
    user.setCapabilities = function (arrCaps) {
        for (var i = 0; i < arrCaps.length; i++) {
            if (!user.hasCapability(arrCaps[i].capability))
                user.capabilities[arrCaps[i].capability] = arrCaps[i];
        }
    }
    user.hasCapability = function (capability) {
        if (user.capabilities.hasOwnProperty(capability)) {
            return true;
        } else {
            return false;
        }
    }
    user.hasToken = function (resourceUri) {
        if (user.tokens.hasOwnProperty(resourceUri)) {
            return true;
        } else {
            return false;
        }
    }
    user.getToken = function (resourceUri) {
        if (user.hasToken(resourceUri)) {
            return user.tokens[resourceUri];
        }
    }
    user.setToken = function (token) {
        if (!token.resource) {
            token.resource = "default";
        }
        user.tokens[token.resource] = token;
    }
})(module.exports);