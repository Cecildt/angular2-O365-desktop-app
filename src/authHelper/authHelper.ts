import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import * as adalConfig from "../adal/adal-config";

@Injectable()
export class AuthHelper {

    private http: Http;
    private access_token: string = null;

    constructor(http: Http) {
        this.http = http;
    }

    public isUserAuthenticated(): boolean {
        var token = localStorage.getItem("accessToken");
        this.access_token = token;
        
        return this.access_token !== null;
    }

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        let p = new Promise<any>((resolve: Function, reject: Function) => {
            let tokenPromise = this.tokenPromise(adalConfig.endpoints.graphApiUri);

            tokenPromise.then((token: string) => {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + token);

                this.http.get(adalConfig.endpoints.graphApiUri + reqUrl, { headers: headers })
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
            let tokenPromise = this.tokenPromise(adalConfig.endpoints.graphApiUri);
            tokenPromise.then((token: string) => {
                var request = new XMLHttpRequest;
                request.open("GET", adalConfig.endpoints.graphApiUri + reqUrl);
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
        window.location.href = "http://localhost:3000/auth";
    }

    public logOut() {
        localStorage.clear();
    }

    private tokenPromise = (endpoint: string): Promise<string> => {
        let p = new Promise<string>((resolve: Function, reject: Function) => {
            var token = window.localStorage.getItem("accessToken");
            if (token && token !== "undefined") {
                resolve(token);
            } else {
                this.logIn();
                reject();
            }
        });

        return p;
    };
}