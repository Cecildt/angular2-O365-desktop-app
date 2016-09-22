var mainConfig = {
    authorityHostUrl: 'https://login.windows.net',
    tenant: 'mod340807.onmicrosoft.com',
    clientId: 'bbffe1fd-bf52-41b2-b898-4903cb73f9db',
    clientSecret: '',
    extraQueryParameter: 'nux=1',
    disableRenewal: true,
    resource: "https://graph.microsoft.com",
    redirectUri: "/",
    postLogoutRedirectUri: "",
    endpoints: {
        graphApiUri: 'https://graph.microsoft.com'
    }
}

module.export = mainConfig;