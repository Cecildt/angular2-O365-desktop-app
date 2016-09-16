import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages";

@Component({
    selector: "my-users",
    templateUrl: "src/users/view-users.html",
})
export class Users {
    private users = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast) {

        this.toast.show(UserMessages.get_users);
        this.getUsers();
    }

    private getUsers() {
        this.authHelper.getRequestPromise("/v1.0/users")
            .then((data: any) => {
                if (data) {
                    this.users = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api)
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api)
            });
    }
}