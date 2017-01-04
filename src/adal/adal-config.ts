export const ADAL_CONFIG = {
  authorityHostUrl:'https://login.windows.net',
  tenant: '<tenant>.onmicrosoft.com',
  clientId: 'xxx-xxx-xxx-xxx-xxx',
  clientSecret: '',
  extraQueryParameter: 'nux=1',
  disableRenewal: true,
  resource: "https://graph.microsoft.com",
  redirectUri:  "http://localhost/azureoauth/callback",
  postLogoutRedirectUri: "",
  endpoints: {
    graphApiUri:'https://graph.microsoft.com'
  }
}
