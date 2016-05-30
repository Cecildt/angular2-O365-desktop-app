var adalConfig = {
  tenant: 'mod340807.onmicrosoft.com',
  clientId: 'bbffe1fd-bf52-41b2-b898-4903cb73f9db',
  extraQueryParameter: 'nux=1',
  disableRenewal: true,
  redirectUri: "http://localhost:3000/auth/azureoauth/callback",
  postLogoutRedirectUri: window.location.origin,
  endpoints: {
    'https://graph.microsoft.com': 'https://graph.microsoft.com'
  }
  // cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost. 
};

module.exports = adalConfig;