/// <reference path="../assets/github-electron.d.ts" />

var electron = require("electron");
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

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
        postLogoutRedirectUri: "http://localhost:8000",
        redirectUri: "http://localhost:8000",
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
    };

    private tokenPromise = (endpoint: string): Promise<string> => {
        var p = new Promise<string>((resolve: Function, reject: Function) => {
            var token = window.localStorage.getItem("access_token");
            if (token && token !== "undefined") {
                resolve(token);
            } else {
                this.getAccessToken();
                reject();
            }
        });

        return p;
    };

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        var p = new Promise<any>((resolve: Function, reject: Function) => {
            var tokenPromise = this.tokenPromise(this.config.endpoints.officeGraph);
            tokenPromise.then((token: string) => {
                var headers = new Headers();
                headers.append("Authorization", "Bearer " + token);
                this.http.get(this.config.endpoints.officeGraph + reqUrl, { headers: headers }).subscribe((res: any) => {
                    if (res.status === 200) {
                        resolve(JSON.parse(res._body));
                    } else {
                        reject("An error occurred calling the Microsoft Graph.");
                    }
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

    private openAuth(authUrl: string) {
        var authWindow = new BrowserWindow({
                            width: 800,
                            height: 600,
                            show: false,
                            frame: true,
                            webPreferences: {
                                nodeIntegration: false
                            } });

        authWindow.loadURL(authUrl);
        authWindow.show();

        authWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            console.log("ID Token - did-get-redirect-request: " + newUrl);
            authWindow.destroy();
            handleCallback(newUrl);
        });

        // reset the authWindow on close
        authWindow.on("close", () => {
            authWindow = null;
        });

        function handleCallback(url: string){
            var authContextHelper = new AuthenticationContext(null);
            var resultURL = new URL(url);
            var requestInfo = authContextHelper.getRequestInfo(resultURL.hash);

            if (requestInfo.parameters.id_token) {
                window.localStorage.setItem("id_token", requestInfo.parameters.id_token);
                authContextHelper.saveTokenFromHash(requestInfo);
            } else {
                window.localStorage.removeItem("id_token");
            }

            remote.getCurrentWindow().reload();
        }
    }

    private getAccessToken() {
		// redirect to get access_token
		var accessUrl = "https://login.microsoftonline.com/" + SvcConsts.TENTANT_ID +
			"/oauth2/authorize?response_type=token&client_id=" + SvcConsts.CLIENT_ID +
			"&resource=" + SvcConsts.GRAPH_RESOURCE +
			"&redirect_uri=" + encodeURIComponent(this.config.redirectUri) +
			"&prompt=none&state=SomeState&nonce=SomeNonce";

        var accessWindow = new BrowserWindow({
                            width: 800,
                            height: 600,
                            show: false,
                            frame: true,
                            webPreferences: {
                                nodeIntegration: false
                            } });

        accessWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            console.log("Access Token - did-get-redirect-request: " + newUrl);
            accessWindow.destroy();
            handleCallback(newUrl);
        });

        accessWindow.loadURL(accessUrl);
        accessWindow.show();

        function handleCallback(url: string){
            var authContextHelper = new AuthenticationContext(null);
            var resultURL = new URL(url);
            var requestInfo = authContextHelper.getRequestInfo(resultURL.hash);

            if (requestInfo.parameters.access_token) {
                window.localStorage.setItem("access_token", requestInfo.parameters.access_token);
                authContextHelper.saveTokenFromHash(requestInfo);
            } else {
                window.localStorage.removeItem("access_token");
            }

            //remote.getCurrentWindow().reload();
        }
	}
}