import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-trending",
    templateUrl: __dirname + "/view-trending.html",
})
export class Trending {
    private trends = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/beta/me/trendingAround").then((data: any) => {
            if (data) {
                this.trends = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}