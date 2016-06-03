import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

@Injectable()
export class ElectronService{
    
    private http: Http;
    
    constructor(http: Http) {
        this.http = http;
    }
        
    public GetInfo(callback: Function){
        this.http.get("http://localhost:3000/info")
                        .map((res: any) => res.json())
                        .subscribe(info => {
                            callback(info);   
                        });
    }
}