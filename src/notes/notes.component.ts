import { Component, OnInit } from "@angular/core";

import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-notes",
    templateUrl: "src/notes/view-notes.html",
})
export class NotesComponent implements OnInit {
    private books = [];

    constructor(private auth: AuthService, private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show(USER_MESSAGES.get_notebooks);
        this.getNotebooks();
    }

    private getNotebooks() {
        this.auth.getRequestPromise(OFFICE_URLS.me_notebooks_url)
            .then((data: any) => {
                if (data) {
                    this.books = data.value;
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}