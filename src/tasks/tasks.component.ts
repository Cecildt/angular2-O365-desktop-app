import { Component, OnInit } from "@angular/core";

import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages"
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-tasks",
    templateUrl: "src/tasks/view-tasks.html",
})
export class TasksComponent implements OnInit {
    private tasks = [];

    constructor(private auth: AuthService, private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show(USER_MESSAGES.get_tasks);
        this.getTasks();
    }

    private getTasks() {
        this.auth.getRequestPromise(OFFICE_URLS.me_tasks_url)
            .then((data: any) => {
                if (data) {
                    this.tasks = data.value;
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}