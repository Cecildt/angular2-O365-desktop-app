import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages";

@Component({
    selector: "my-tasks",
    templateUrl: "src/tasks/view-tasks.html",
})
export class Tasks {
    private tasks = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast) {

        this.toast.show(UserMessages.get_tasks);
        this.getTasks();
    }

    private getTasks() {
        this.authHelper.getRequestPromise("/beta/me/tasks")
            .then((data: any) => {
                if (data) {
                    this.tasks = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}