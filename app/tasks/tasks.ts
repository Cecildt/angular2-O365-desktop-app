import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "app-user",
    templateUrl: "./tasks/view-tasks.html",
})
export class Tasks {
    private tasks = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/beta/me/tasks").then((data: any) => {
            if (data) {
                this.tasks = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}