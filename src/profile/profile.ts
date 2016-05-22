import { Component, Injectable } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-profile",
    template: "<img src='{{photo}}' width='80' height='80' /><h5>Welcome {{displayName}}</h5>",
})
@Injectable()
export class Profile {
    private displayName: string = "";
    private photo: string = "";

    constructor(public authHelper: AuthHelper) {
        this.refreshInfo();
    }

    public refreshInfo(){
        
        if (!this.authHelper.isUserAuthenticated) {
            return;
        }
        
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