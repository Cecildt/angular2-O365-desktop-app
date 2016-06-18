import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages"


@Component({
    selector: "my-notes",
    templateUrl: "src/notes/view-notes.html",
})
export class Notes {
    private books = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_notebooks);
                this.getNotebooks();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });
    }

    private getNotebooks() {
        this.authHelper.getRequestPromise("/beta/me/notes/notebooks")
            .then((data: any) => {
                if (data) {
                    this.books = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}