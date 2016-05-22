import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-files",
    templateUrl: "src/files/view-files.html"
})

export class Files {
    private files = [];
    private authHelper: AuthHelper;

    constructor(auth: AuthHelper, router: Router) {
        this.authHelper = auth;
        
        if (!auth.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
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