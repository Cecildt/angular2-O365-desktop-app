
(function (appSettings) {
    // Set the Azure tenant for your Office 365 Developer site.
    appSettings.tenant = "mod340807";
    // Configure the OAuth options to match your app.
    appSettings.oauthOptions = {
        clientId: "e5635297-313a-450f-88f5-2a9212df8130"
        , clientSecret: "6UFu0jT9n+IPnW4TSn7FX9ZrN8Xua6R5/ZCtY1Sk/ms="
        , tenantId: "mod340807.onmicrosoft.com"
        , resource: "https://graph.microsoft.com"
        // The redirectURL is set in AAD. For the following redirectURL
        // "http://localhost:3000/auth/azureoauth/callback",
        // the app needs to supply a matching middleware:
        // app.get('/auth/azureoauth/callback', ...)
        // to receive the auth results
    };
    appSettings.resources = {
        exchange: "https://outlook.office365.com/",
        onedrive: 'https://' + appSettings.tenant + '-my.sharepoint.com/',
        sharepoint: 'https://' + appSettings.tenant + '.sharepoint.com/',
        discovery: 'https://api.office.com/discovery/'
    }
    appSettings.apiEndpoints = {
        exchangeBaseUrl: "https://outlook.office365.com/api/v1.0/me",
        oneDriveBusinessBaseUrl: "https://" + appSettings.tenant + "-my.sharepoint.com/_api/v1.0/me",
        sharePointSiteBaseUrl: "https://" + appSettings.tenant + ".sharepoint.com/_api/web",
        discoveryServiceBaseUrl: "https://api.office.com/discovery/v1.0/me",
        accessTokenRequestUrl: "https://login.windows.net/common/oauth2/token"
    };
    appSettings.useFiddler = false;
})(module.exports);


// Web App
// clientId: "e5635297-313a-450f-88f5-2a9212df8130"
// clientSecret: "6UFu0jT9n+IPnW4TSn7FX9ZrN8Xua6R5/ZCtY1Sk/ms="
// tenantId: "mod340807.onmicrosoft.com"



// Native App
// clientId: "bbffe1fd-bf52-41b2-b898-4903cb73f9db"
// clientSecret: ""
// tenantId: "mod340807.onmicrosoft.com"