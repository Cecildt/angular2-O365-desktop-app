import { Component, OnInit } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-mails",
    templateUrl: "src/mails/view-mails.html",
})
export class MailsComponent implements OnInit {
    private messages = [];

    constructor(private graph: GraphService,
        private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show(USER_MESSAGES.get_mails);
        this.getMails();
    }

    private getMails() {
        this.graph.getRequestPromise(OFFICE_URLS.me_messages_url)
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