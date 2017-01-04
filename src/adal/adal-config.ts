export const ADAL_CONFIG = {
  authorityHostUrl:'https://login.windows.net',
  tenant: 'devlaundry.onmicrosoft.com',
  clientId: 'xxx-xxx-xxx-xxx-xxx',
  clientSecret: '',
  extraQueryParameter: 'nux=1',
  disableRenewal: true,
  resource: "https://graph.microsoft.com",
  redirectUri:  "http://localhost/callback",
  postLogoutRedirectUri: "",
  endpoints: {
    graphApiUri:'https://graph.microsoft.com'
  }
}
