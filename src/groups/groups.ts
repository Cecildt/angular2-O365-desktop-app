import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages"

@Component({
    selector: "my-groups",
    templateUrl: "src/groups/view-groups.html",
})
export class Groups {
    private groups = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast) {

        this.toast.show(UserMessages.get_groups);
        this.getGroups();
    }

    private getGroups() {
        this.authHelper.getRequestPromise("/v1.0/me/memberOf/$/microsoft.graph.group")
            .then((data: any) => {
                if (data) {
                    this.groups = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}