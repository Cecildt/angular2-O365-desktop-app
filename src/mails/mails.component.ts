import { Component, OnInit } from "@angular/core";

import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-mails",
    templateUrl: "src/mails/view-mails.html",
})
export class MailsComponent implements OnInit {
    private messages = [];

    constructor(private auth: AuthService,
        private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show(USER_MESSAGES.get_mails);
        this.getMails();
    }

    private getMails() {
        this.auth.getRequestPromise(OFFICE_URLS.me_messages_url)
            .then((data: any) => {
                if (data) {
                    this.messages = data.value;
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}