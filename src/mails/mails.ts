import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-mails",
    templateUrl: "src/mails/view-mails.html",
})
export class Mails {
    private messages = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/v1.0/me/messages").then((data: any) => {
            if (data) {
                this.messages = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}