import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/toPromise';

import { InfoModel } from "../models/infoModel";

@Injectable()
export class ElectronService {

    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public GetInfo(): Promise<InfoModel> {
        return new Promise<InfoModel>(resolve => {
            this.http.get("http://localhost:3000/info")
                .toPromise()
                .then(response => response.json() as InfoModel)
                .catch(this.handleError)
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}