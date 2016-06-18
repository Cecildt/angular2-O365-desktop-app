import { Component, Injectable } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";

@Component({
    selector: "my-profile",
    template: "<img src='{{photo}}' width='80' height='80' /><h5>Welcome {{displayName}}</h5>",
})
@Injectable()
export class Profile {
    private displayName: string = "";
    private photo: string = "";

    constructor(public authHelper: AuthHelper, public toast: Toast) {
        this.refreshInfo();
    }

    public refreshInfo() {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.getUserName();
                this.getUserPhoto();
            })
            .catch((reason) => {
                this.toast.show("You are not authenticated!");
            });
    }

    private getUserName() {
        this.authHelper.getRequestPromise("/v1.0/me/").then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        }).catch(() => {
            this.toast.show("Failed to get your name!");
        });
    }

    private getUserPhoto() {
        this.authHelper.getPhotoRequestPromise("/v1.0/me/photo/$value").then((data: any) => {
            if (data) {
                this.photo = data;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        }).catch(() => {
            this.toast.show("Failed to get your photo!");
        });;
    }
}