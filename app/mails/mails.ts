import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "app-user",
    templateUrl: "./mails/view-mails.html",
})
export class Mails {
    private messages = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/me/messages").then((data: any) => {
            if (data) {
                this.messages = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}