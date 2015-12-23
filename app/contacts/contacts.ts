import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-contacts",
    templateUrl: "./contacts/view-contacts.html",
})
export class Contacts {
    private contacts = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/me/contacts").then((data: any) => {
            if (data) {
                this.contacts = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}