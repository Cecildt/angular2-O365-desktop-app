import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-trending",
    templateUrl: "./trending/view-trending.html",
})
export class Trending {
    private files = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/beta/me/trendingAround").then((data: any) => {
            if (data) {
                this.files = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}