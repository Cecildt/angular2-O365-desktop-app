const electron = require("electron");
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

export class AuthHelper {

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        let p = new Promise<any>((resolve: Function, reject: Function) => {
            let tokenPromise = this.tokenPromise(SvcConsts.GRAPH_RESOURCE);

            tokenPromise.then((token: string) => {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + token);

                this.http.get(SvcConsts.GRAPH_RESOURCE + reqUrl, { headers: headers })
                         .map((res: any) => res.json())
                         .subscribe(
                             (res: any) => resolve(res),
                             (error: any) => reject(error));
            });
        });

        return p;
    };

    public getPhotoRequestPromise = (reqUrl: string): Promise<any> => {
        let p = new Promise<any>((resolve: Function, reject: Function) => {
            let tokenPromise = this.tokenPromise(SvcConsts.GRAPH_RESOURCE);
            tokenPromise.then((token: string) => {
                var request = new XMLHttpRequest;
                request.open("GET", SvcConsts.GRAPH_RESOURCE + reqUrl);
                request.setRequestHeader("Authorization", "Bearer " + token);
                request.responseType = "blob";
                request.onload = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        let reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                        };

                        reader.readAsDataURL(request.response);
                    } else {
                        reject("An error occurred calling the Microsoft Graph.");
                    }
                };

                request.send(null);
            });
        });

        return p;
    };

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

        const reply = ipc.sendSync('login-event', 'ping');
        console.log("Login Event Result: " + reply);

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

            let tokenURL: any = new URL(newUrl);
            let params: any = this.parseQueryString(tokenURL.hash);

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