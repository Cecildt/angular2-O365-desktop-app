/// <reference path="../assets/github-electron.d.ts" />

import { Injectable } from "angular2/core";
import { Http, Headers } from "angular2/http";
import { SvcConsts } from "../svcConsts/svcConsts";

@Injectable()
export class AuthHelper {

    /**
     * Configuration object for the instantiation of the ADAL authContext object
     */
    private config: any = {
        tenant: SvcConsts.TENTANT_ID,
        clientId: SvcConsts.CLIENT_ID,
        postLogoutRedirectUri: window.location.origin,
        endpoints: {
            officeGraph: SvcConsts.GRAPH_RESOURCE
        },
        cacheLocation: "localStorage", // enable this for IE, as sessionStorage does not work for localhost.
        displayCall: this.openAuth
    };

    private currentUser: any;
    http: Http;
    authContext: any;

    get isUserAuthenticated(): boolean {
        return !!this.currentUser;
    }

    get currentUserName(): string {
        return this.isUserAuthenticated ? this.currentUser.profile.name : "";
    }

    get userPropr(): Array<any> {
        var userProps = new Array<any>();
        for (var property in this.currentUser.profile) {
            if (this.currentUser.profile.hasOwnProperty(property)) {
                userProps.push({ propertyName: property, value: this.currentUser.profile[property] });
            }
        }

        return userProps;
    }

    constructor(http: Http) {
        this.http = http;
        this.authContext = new AuthenticationContext(this.config);
        this.handleLogInCallBack();
    }

    private handleLogInCallBack = (): void => {
        var isCallback = this.authContext.isCallback(window.location.hash);
        this.authContext.handleWindowCallback();
        this.currentUser = this.authContext.getCachedUser();
        var logError = - this.authContext.getLoginError();

        if (!!logError) {
            alert(logError);
        } else if (isCallback && !logError) {
            window.location = this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
        }
    }

    private tokenPromise = (endpoint: string): Promise<string> => {
        var p = new Promise<string>((resolve, reject) => {
            this.authContext.acquireToken(endpoint, function(error, token) {
                if (error || !token) {
                    alert("ADAL error occurred: " + error);
                    return;
                } else {
                    resolve(token);
                }
            }).fail(function() {
                console.log("fetching files from onedrive failed.");
                alert("something went wrong! try refreshing the page.");
            });
        });
        return p
    }

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        var p = new Promise<any>((resolve, reject) => {
            var tokenPromise = this.tokenPromise(this.config.endpoints.officeGraph);
            tokenPromise.then((token: string) => {
                var headers = new Headers();
                headers.append("Authorization", "Bearer " + token);
                this.http.get(this.config.endpoints.officeGraph + reqUrl, { headers: headers }).subscribe((res: any) => {
                    resolve(JSON.parse(res._body));
                });
            });
        });

        return p;
    }

    public logIn() {
        this.authContext.login();
    }

    public logOut() {
        this.authContext.logOut();
    }

    private openAuth(authUrl: string){
        var authWindow = new GitHubElectron.BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            node-integration: false });

        authWindow.loadUrl(authUrl);
        authWindow.show();

        authWindow.webContents.on('will-navigate', function (event, url) {
            // this.handleCallback(url);
            console.log("will-navigate: " + url);
            authWindow.destroy();
        });

        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            // this.handleCallback(newUrl);
            console.log("did-get-redirect-request: " + newUrl);
            authWindow.destroy();
        });

        // reset the authWindow on close
        authWindow.on('close', function() {
            authWindow = null;
        }, false);
    }
}