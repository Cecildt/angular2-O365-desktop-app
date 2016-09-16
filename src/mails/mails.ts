import { Component } from "@angular/core";

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
        public toast: Toast) {

        this.toast.show(UserMessages.get_mails);
        this.getMails();
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