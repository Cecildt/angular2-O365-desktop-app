import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";
import { Router } from "@angular/router-deprecated";

@Component({
    selector: "my-contacts",
    templateUrl: "src/contacts/view-contacts.html",
})
export class Contacts {
    private contacts = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/v1.0/me/contacts").then((data: any) => {
            if (data) {
                this.contacts = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}