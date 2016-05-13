import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-files",
    templateUrl: __dirname + "/view-files.html"
})

export class Files {
    private files = [];
    private authHelper: AuthHelper;

    constructor(authHelper: AuthHelper) {
        this.authHelper = authHelper;
        this.refreshInfo();
    }

    public refreshInfo(){
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