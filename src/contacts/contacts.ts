import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages"

@Component({
    selector: "my-contacts",
    templateUrl: "src/contacts/view-contacts.html",
})
export class Contacts {
    private contacts = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast) {

        this.toast.show(UserMessages.get_contacts);
        this.getContacts();
    }

    private getContacts() {
        this.authHelper.getRequestPromise("/v1.0/me/contacts")
            .then((data: any) => {
                if (data) {
                    this.contacts = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}