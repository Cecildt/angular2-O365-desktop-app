import { Component } from "@angular/core";

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
        public toast: Toast) {

        this.toast.show(UserMessages.get_files);
        this.getFiles();
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