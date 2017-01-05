import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { remote } from "electron";

import { RuntimeInfoModel } from "../models/runtime-info.model";
import { AZURE_CONFIG } from "../config/azure-config";

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
        let originalURL = location.href;
        let authUrl = "https://login.microsoftonline.com/" + AZURE_CONFIG.tenant +
            "/oauth2/authorize?response_type=id_token&client_id=" + AZURE_CONFIG.clientId +
            "&redirect_uri=" + encodeURIComponent(AZURE_CONFIG.redirectUri) +
            "&state=" + state + "&nonce=SomeNonce";
        let BrowserWindow = remote.BrowserWindow;

        let authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            frame: true,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false
            }
        });

        authWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            authWindow.destroy();
            let params: any = this.parseQueryString(newUrl);
            if (params["id_token"] != null) {
                window.localStorage.setItem("id_token", params["id_token"]);
                window.localStorage.removeItem("access_token");

                this.getNewAccessToken();
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


    public getNewAccessToken(state = "/"){
        let originalURL = location.href;
        let accessTokenUrl = "https://login.microsoftonline.com/" + AZURE_CONFIG.tenant +
                    "/oauth2/authorize?response_type=token&client_id=" + AZURE_CONFIG.clientId +
                    "&resource=" + AZURE_CONFIG.endpoints.graphApiUri +
                    "&redirect_uri=" + encodeURIComponent(AZURE_CONFIG.redirectUri) +
                    "&prompt=none&state=" + state + "&nonce=SomeNonce";
        let BrowserWindow = remote.BrowserWindow;

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
                window.localStorage.removeItem("access_token");
            }
        });

        accessWindow.loadURL(accessTokenUrl);
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
}