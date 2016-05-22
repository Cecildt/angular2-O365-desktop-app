
import { SvcConsts } from "../svcConsts/svcConsts";
import { remote, ipcRenderer } from 'electron';

let {BrowserWindow} = remote;

export class AuthService {
    
    constructor(){}
    
    public logIn() {
       let loginUrl = "https://login.microsoftonline.com/" + SvcConsts.TENTANT_ID +
			"/oauth2/authorize?response_type=id_token&client_id=" + SvcConsts.CLIENT_ID +
			"&redirect_uri=" + encodeURIComponent(SvcConsts.REDIRECT_URL) +
			"&state=SomeState&nonce=SomeNonce";

       this.openAuth(loginUrl);
    }

    public logOut() {
        let logoutUrl = "https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri="
                         + encodeURIComponent(SvcConsts.REDIRECT_URL);

        let logOutWindow = new BrowserWindow({
                            width: 800,
                            height: 600,
                            show: false,
                            frame: false,
                            webPreferences: {
                                nodeIntegration: false
                            } });

        logOutWindow.webContents.on("did-finish-load", (event: any, oldUrl: string, newUrl: string) => {
            window.localStorage.removeItem("id_token");
            window.localStorage.removeItem("access_token");

            logOutWindow.destroy();

            remote.getCurrentWindow().reload();
        });

        // reset the accessWindow on close
        logOutWindow.on("closed", () => {
            logOutWindow = null;
        });

        logOutWindow.loadURL(logoutUrl);
    }

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
            authWindow.destroy();
            var url = document.createElement('a');
            url.href = newUrl;
            // let tokenURL: any = URL(newUrl);
            let params: any = this.parseQueryString(url.hash);

            if (params.id_token != null) {
                window.localStorage.setItem("id_token", params.id_token);
            } else {
                window.localStorage.removeItem("id_token");
            }

            remote.getCurrentWindow().reload();
        });

        // reset the authWindow on close
        authWindow.on("closed", () => {
            authWindow = null;
        });


        authWindow.loadURL(authUrl);
        authWindow.show();
    }

    private getAccessToken() {
		let id_token = window.localStorage.getItem("id_token");

        if (!id_token) {
            return;
        }

        let accessUrl = "https://login.microsoftonline.com/" + SvcConsts.TENTANT_ID +
			"/oauth2/authorize?response_type=token&client_id=" + SvcConsts.CLIENT_ID +
			"&resource=" + SvcConsts.GRAPH_RESOURCE +
			"&redirect_uri=" + encodeURIComponent(SvcConsts.REDIRECT_URL) +
			"&prompt=none&state=SomeState&nonce=SomeNonce";

        let accessWindow = new BrowserWindow({
                            width: 800,
                            height: 600,
                            show: false,
                            frame: false,
                            webPreferences: {
                                nodeIntegration: false
                            } });

        accessWindow.webContents.on("did-get-redirect-request", (event: any, oldUrl: string, newUrl: string) => {
            accessWindow.destroy();

            let url = document.createElement('a');
            url.href = newUrl;
            // let tokenURL: any = new URL(newUrl);
            let params: any = this.parseQueryString(url.hash);

            if (params.access_token != null) {
                window.localStorage.setItem("access_token", params.access_token);
            } else {
                window.localStorage.removeItem("access_token");
            }
        });

        // reset the accessWindow on close
        accessWindow.on("closed", () => {
            accessWindow = null;
        });

        accessWindow.loadURL(accessUrl);
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