import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

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
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_users);
                this.getUsers();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });
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