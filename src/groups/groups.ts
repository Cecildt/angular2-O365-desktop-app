import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-groups",
    templateUrl: __dirname + "/view-groups.html",
})
export class Groups {
    private groups = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/me/memberOf/$/microsoft.graph.group")
        .then((data: any) => {
            if (data) {
                this.groups = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}