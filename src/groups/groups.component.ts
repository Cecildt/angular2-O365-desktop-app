import { Component, OnInit } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-groups",
    templateUrl: "src/groups/view-groups.html",
})
export class GroupsComponent implements OnInit {
    private groups = [];

    constructor(public graph: GraphService,
        public toast: ToastComponent) {
    }

    ngOnInit() {
        this.toast.show(USER_MESSAGES.get_groups);
        this.getGroups();
    }

    private getGroups() {
        this.graph.getRequestPromise(OFFICE_URLS.me_groups_url)
            .then((data: any) => {
                if (data) {
                    this.groups = data.value;
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}