import { Component } from "angular2/core";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "files",
    templateUrl: "./files/view-files.html"
})

export class Files {
    private files = [];

    constructor(authHelper: AuthHelper) {
        // perform REST call into Microsoft Graph for files on OneDrive for Business
        authHelper.getRequestPromise("/v1.0/me/drive/root/children").then((data: any) => {
            if (data) {
                this.files = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}