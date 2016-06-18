import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages"

@Component({
    selector: "my-mails",
    templateUrl: "src/mails/view-mails.html",
})
export class Mails {
    private messages = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_mails);
                this.getMails();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });
    }

    private getMails() {
        this.authHelper.getRequestPromise("/v1.0/me/messages")
            .then((data: any) => {
                if (data) {
                    this.messages = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}