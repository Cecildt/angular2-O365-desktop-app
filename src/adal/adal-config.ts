export class AdalConfig {
  public authorityHostUrl: string = 'https://login.windows.net';
  tenant: string = 'mod340807.onmicrosoft.com';
  clientId: string = 'bbffe1fd-bf52-41b2-b898-4903cb73f9db';
  clientSecret: string = '';
  extraQueryParameter: string = 'nux=1';
  disableRenewal: boolean = true;
  resource: string = "https://graph.microsoft.com";
  redirectUri: string = "http://localhost:3000/auth/azureoauth/callback";
  postLogoutRedirectUri: string = "";
  endpoints: any = {
    graphApiUri:'https://graph.microsoft.com'
  }
}