import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-notes",
    templateUrl: __dirname + "/view-notes.html",
})
export class Notes {
    private books = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/beta/me/notes/notebooks").then((data: any) => {
            if (data) {
                this.books = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}