import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-tasks",
    templateUrl: "src/tasks/view-tasks.html",
})
export class Tasks {
    private tasks = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/beta/me/tasks").then((data: any) => {
            if (data) {
                this.tasks = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}