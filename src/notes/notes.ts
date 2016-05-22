import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-notes",
    templateUrl: "src/notes/view-notes.html",
})
export class Notes {
    private books = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/beta/me/notes/notebooks").then((data: any) => {
            if (data) {
                this.books = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}