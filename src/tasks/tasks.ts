import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

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
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_tasks);
                this.getTasks();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });
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