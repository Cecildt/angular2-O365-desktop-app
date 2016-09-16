import { Component, OnInit } from "@angular/core";

import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-contacts",
    templateUrl: "src/contacts/view-contacts.html",
})
export class ContactsComponent implements OnInit {
    private contacts = [];

    constructor(private auth: AuthService,
        private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show(USER_MESSAGES.get_contacts);
        this.getContacts();
    }

    private getContacts() {
        this.auth.getRequestPromise(OFFICE_URLS.me_contacts_url)
            .then((data: any) => {
                if (data) {
                    this.contacts = data.value;
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}