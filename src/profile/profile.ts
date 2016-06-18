import { Component, Injectable } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages"

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
                this.toast.show(UserMessages.not_authenticated);
            });
    }

    private getUserName() {
        this.authHelper.getRequestPromise("/v1.0/me/").then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {                
                this.toast.show(UserMessages.fail_username);
            }
        }).catch(() => {
            this.toast.show(UserMessages.fail_graph_api);
        });
    }

    private getUserPhoto() {
        this.authHelper.getPhotoRequestPromise("/v1.0/me/photo/$value").then((data: any) => {
            if (data) {
                this.photo = data;
            } else {
                this.toast.show(UserMessages.fail_user_photo);                
            }
        }).catch(() => {
            this.toast.show(UserMessages.fail_graph_api);
        });
    }
}