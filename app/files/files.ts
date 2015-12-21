import { Component, View } from "angular2/core";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "files"
})

@View({
    templateUrl: "src/files/view-files.html"
})
export class Files {
    private files = [];
    constructor(authHelper: AuthHelper) {
        // perform REST call into Microsoft Graph for files on OneDrive for Business
        authHelper.getRequestPromise("/v1.0/me/drive/root/children").then((data) => {
            if (data.status === 200) {
                this.files = data.json().value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data.status);
            }
        });
    }
}