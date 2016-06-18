import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";

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
                this.toast.show("Getting you files...");
                this.refreshInfo();
            })
            .catch(() => {
                this.toast.show("Redirecting to Login...");
                router.navigate(["/Login"]);
            });
    }

    public refreshInfo() {
        // perform REST call into Microsoft Graph for files on OneDrive for Business
        this.authHelper.getRequestPromise("/v1.0/me/drive/root/children").then((data: any) => {
            if (data) {
                this.files = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}