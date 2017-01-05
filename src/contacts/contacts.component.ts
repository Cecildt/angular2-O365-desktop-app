import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages";
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-contacts",
    templateUrl: "src/contacts/view-contacts.html",
})
export class ContactsComponent implements OnInit {
    private contacts = [];

    constructor(private graph: GraphService,
                private toast: ToastComponent,
                private changeRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.toast.show(USER_MESSAGES.get_contacts);
        this.getContacts();
    }

    private getContacts() {
        this.graph.getRequestPromise(OFFICE_URLS.me_contacts_url)
            .then((data: any) => {
                if (data) {
                    this.contacts = data.value;
                    this.changeRef.detectChanges();
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}
