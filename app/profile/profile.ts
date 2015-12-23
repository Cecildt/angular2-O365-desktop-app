import { Component, Injectable } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-profile",
    template: "<img src='{{photo}}' width='80' height='80' /><h5>Welcome {{displayName}}</h5>",
})
@Injectable()
export class Profile {
    private displayName: string = "";
    private photo: string = "";
    private authHelper: AuthHelper;

    constructor(authHelper: AuthHelper) {
        this.authHelper = authHelper;
        this.refreshInfo();
    }

    public refreshInfo(){
        this.authHelper.getRequestPromise("/v1.0/me/").then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });

         this.authHelper.getPhotoRequestPromise("/v1.0/me/photo/$value").then((data: any) => {
            if (data) {
                this.photo = data;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}