import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages";
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-users",
    templateUrl: "src/users/view-users.html",
})
export class UsersComponent implements OnInit {
    private users = [];

    constructor(private graph: GraphService,
                private toast: ToastComponent,
                private changeRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.toast.show(USER_MESSAGES.get_users);
        this.getUsers();
    }

    private getUsers() {
        this.graph.getRequestPromise(OFFICE_URLS.all_users_url)
            .then((data: any) => {
                if (data) {
                    this.users = data.value;
                    this.changeRef.detectChanges();
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api)
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api)
            });
    }
}
