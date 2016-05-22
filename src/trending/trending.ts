import { Component } from "@angular/core";
import { Router } from "@angular/router-deprecated";

import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-trending",
    templateUrl: "src/trending/view-trending.html",
})
export class Trending {
    private trends = [];

    constructor(public authHelper: AuthHelper, router: Router) {
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
        
        this.authHelper.getRequestPromise("/beta/me/trendingAround").then((data: any) => {
            if (data) {
                this.trends = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}