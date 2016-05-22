import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";


@Component({
    selector: "my-groups",
    templateUrl: "src/groups/view-groups.html",
})
export class Groups {
    private groups = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/v1.0/me/memberOf/$/microsoft.graph.group")
        .then((data: any) => {
            if (data) {
                this.groups = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}