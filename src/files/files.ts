import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages";

@Component({
    selector: "my-files",
    templateUrl: "src/files/view-files.html"
})

export class Files {
    private files = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast,
        router: Router) {

        this.authHelper.isUserAuthenticated()
            .then(() => {
                this.toast.show(UserMessages.get_files);
                this.getFiles();
            })
            .catch(() => {
                this.toast.show(UserMessages.redirect_login);
                router.navigate(["/Login"]);
            });
    }

    public getFiles() {
        // perform REST call into Microsoft Graph for files on OneDrive for Business
        this.authHelper.getRequestPromise("/v1.0/me/drive/root/children")
            .then((data: any) => {
                if (data) {
                    this.files = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            }).catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}