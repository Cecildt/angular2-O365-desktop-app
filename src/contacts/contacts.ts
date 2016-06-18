import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

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
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_contacts);
                this.getContacts();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });

        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
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