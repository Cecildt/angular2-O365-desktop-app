import { Component, OnInit, Injectable } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages";
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-profile",
    template: "<img src='{{photo}}' width='80' height='80' /><h5>Welcome {{displayName}}</h5>",
})
@Injectable()
export class ProfileComponent implements OnInit {
    private displayName: string = "User";
    private photo: string = "";

    constructor(private graph: GraphService, private toast: ToastComponent) {
    }

    public ngOnInit() {
        this.refreshInfo();
    }

    public refreshInfo() {

        this.graph.isUserAuthenticated()
            .then(() => {
                this.getUserName();
                this.getUserPhoto();
            })
            .catch((reason) => {
                this.toast.show(USER_MESSAGES.not_authenticated);
            });
    }

    private getUserName() {
        this.graph.getRequestPromise(OFFICE_URLS.me_profile_url).then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {
                this.toast.show(USER_MESSAGES.fail_username);
            }
        }).catch(() => {
            this.toast.show(USER_MESSAGES.fail_graph_api);
        });
    }

    private getUserPhoto() {
        this.graph.getPhotoRequestPromise(OFFICE_URLS.me_photo_url).then((data: any) => {
            if (data) {
                this.photo = data;
            } else {
                this.toast.show(USER_MESSAGES.fail_user_photo);
            }
        }).catch(() => {
            this.toast.show(USER_MESSAGES.fail_graph_api);
        });
    }
}
