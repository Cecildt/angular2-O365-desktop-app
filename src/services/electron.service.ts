import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { remote } from "electron";

import { RuntimeInfoModel } from "../models/runtime-info.model";

@Injectable()
export class ElectronService {

    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public getInfo(): RuntimeInfoModel {
        return new RuntimeInfoModel(
            remote.process.versions.node,
            remote.process.versions.chrome,
            remote.process.versions.electron);
    }
  
    public logIn(state = "/") {
        let clientID = "94e57a3e-2436-4b86-a280-5286e2152a22";
        let originalURL = location.href;
        let authUrl = "https://login.microsoftonline.com/" + this._serviceConstants.tenantID +
            "/oauth2/authorize?response_type=id_token&client_id=" + this._serviceConstants.clientID +
            "&redirect_uri=" + encodeURIComponent(this._serviceConstants.redirectURL) +
            "&state=" + state + "&nonce=SomeNonce";
        let BrowserWindow = remote.BrowserWindow;        

        let authWindow = new BrowserWindow({
            width: 800, height: 600, show: false, frame: false, webPreferences: { nodeIntegration: false }
        });

        authWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            authWindow.destroy();
            let params: any = this.parseQueryString(newUrl);
            if (params["id_token"] != null) {
                window.localStorage.setItem("id_token", params["id_token"]);

                let accessTokenUrl = "";

                let accessWindow = new BrowserWindow({
                    width: 800, height: 600, show: false, frame: false, webPreferences: { nodeIntegration: false }
                });

                accessWindow.on("closed", () => {
                    accessWindow = null;
                });

                accessWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
                    accessWindow.destroy();
                    let params: any = this.parseQueryString(newUrl);

                    if (params["access_token"] != null) {
                        window.localStorage.setItem("access_token", params["access_token"]);
                        remote.getCurrentWindow().loadURL(originalURL + "index.html");
                    } else {
                        window.localStorage.removeItem("id_token");
                        window.localStorage.removeItem("access_token");
                    }
                });

                accessWindow.loadURL(accessTokenUrl);
            } else {
                window.localStorage.removeItem("id_token");
                window.localStorage.removeItem("access_token");
            }
        });

        // reset the authWindow on close
        authWindow.on("closed", () => {
            authWindow = null;
        });

        authWindow.loadURL(authUrl);
        authWindow.show();
    }

    logOut(state = "/") {
        window.localStorage.removeItem("id_token");
        window.localStorage.removeItem("access_token");
        remote.getCurrentWindow().loadURL(location.href + "index.html");
    }

    refreshAccessToken(state = "/") {
        this.logIn(state); // force login, assume that renewToken.html didn't work which is why dev is calling this.
    }

    public getAccessToken() {
        return window.localStorage.getItem("access_token");
    }

    private parseQueryString(url: string) {
        var params = {};
        var queryString = "";
        if (url.search("#") != -1) {
            queryString = url.substring(url.search("#") + 1);

        } else {
            queryString = url.substring(url.indexOf("?") + 1);
        }
        var a = queryString.split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            params[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return params;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}