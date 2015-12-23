import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "app-user",
    template: "<img src='{{photo}}' /><strong>Welcome {{displayName}}</strong>",
})
export class User {
    private displayName: string = "";
    private photo: string;

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/me/").then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });

         authHelper.getPhotoRequestPromise("/v1.0/me/photo/$value").then((data: any) => {
            if (data) {
                this.photo = data;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}