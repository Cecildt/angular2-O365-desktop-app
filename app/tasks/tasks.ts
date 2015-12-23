import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "app-user",
    template: "<p>Tasks</p>",
})
export class Tasks {
    private displayName: string = "";

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/me/").then((data: any) => {
            if (data) {
                this.displayName = data.displayName;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}