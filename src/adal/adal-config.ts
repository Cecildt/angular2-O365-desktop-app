export const ADAL_CONFIG = {
  authorityHostUrl:'https://login.windows.net',
  tenant: 'devlaundry.onmicrosoft.com',
  clientId: '8582721b-acf4-4f1e-b1a3-6be84a8b55f7',
  extraQueryParameter: 'nux=1',
  disableRenewal: true,
  resource: "https://graph.microsoft.com",
  redirectUri:  "http://localhost/callback",
  postLogoutRedirectUri: "",
  endpoints: {
    graphApiUri:'https://graph.microsoft.com'
  }
}
