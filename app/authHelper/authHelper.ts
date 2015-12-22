var electron = require("electron");
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

import { Injectable } from "angular2/core";
import { Http, Headers } from "angular2/http";
import { SvcConsts } from "../svcConsts/svcConsts";

@Injectable()
export class AuthHelper {

    http: Http;

    constructor(http: Http) {
        this.http = http;

        let id_token = window.localStorage.getItem("id_token");

        if (id_token != null){
            this.getAccessToken();
        }
    }

    public get isUserAuthenticated() : boolean {
        let id_token = window.localStorage.getItem("id_token");
        return id_token != null;
    }

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        let p = new Promise<any>((resolve: Function, reject: Function) => {
            let tokenPromise = this.tokenPromise(SvcConsts.GRAPH_RESOURCE);
            tokenPromise.then((token: string) => {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + token);
                this.http.get(SvcConsts.GRAPH_RESOURCE + reqUrl, { headers: headers }).subscribe((res: any) => {
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
       let loginUrl = "https://login.microsoftonline.com/" + SvcConsts.TENTANT_ID +
			"/oauth2/authorize?response_type=id_token&client_id=" + SvcConsts.CLIENT_ID +
			"&redirect_uri=" + encodeURIComponent(SvcConsts.REDIRECT_URL) +
			"&state=SomeState&nonce=SomeNonce";

       this.openAuth(loginUrl);
    }

    private tokenPromise = (endpoint: string): Promise<string> => {
        let p = new Promise<string>((resolve: Function, reject: Function) => {
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

    private openAuth(authUrl: string) {
        let authWindow = new BrowserWindow({
                            width: 800,
                            height: 600,
                            show: false,
                            frame: false,
                            webPreferences: {
                                nodeIntegration: false
                            } });

        authWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            console.log("ID Token - did-get-redirect-request: " + newUrl);
            authWindow.destroy();
            let tokenURL: any = new URL(newUrl);
            let params: any = this.parseQueryString(tokenURL.hash);

            if (params.id_token != null) {
                window.localStorage.setItem("id_token", params.id_token);
            } else {
                window.localStorage.removeItem("id_token");
            }

            remote.getCurrentWindow().reload();
        });

        // reset the authWindow on close
        authWindow.on("close", () => {
            authWindow = null;
        });


        authWindow.loadURL(authUrl);
        authWindow.show();
    }

    private getAccessToken() {
		let accessUrl = "https://login.microsoftonline.com/" + SvcConsts.TENTANT_ID +
			"/oauth2/authorize?response_type=token&client_id=" + SvcConsts.CLIENT_ID +
			"&resource=" + SvcConsts.GRAPH_RESOURCE +
			"&redirect_uri=" + encodeURIComponent(SvcConsts.REDIRECT_URL) +
			"&prompt=none&state=SomeState&nonce=SomeNonce";

        let accessWindow = new BrowserWindow({
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

            let tokenURL: any = new URL(newUrl);
            let params: any = this.parseQueryString(tokenURL.hash);

            if (params.access_token != null) {
                window.localStorage.setItem("access_token", params.access_token);
            } else {
                window.localStorage.removeItem("access_token");
            }
        });

        // reset the accessWindow on close
        accessWindow.on("close", () => {
            accessWindow = null;
        });

        accessWindow.loadURL(accessUrl);
        accessWindow.show();
	}

    private parseQueryString(url: string) {
		let params = {}, queryString = url.substring(1),
		regex = /([^&=]+)=([^&]*)/g, m;

		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}

		return params;
	}
}