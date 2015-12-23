import { Component } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-users",
    templateUrl: "./users/view-users.html",
})
export class Users {
    private users = [];

    constructor(authHelper: AuthHelper) {
        authHelper.getRequestPromise("/v1.0/users").then((data: any) => {
            if (data) {
                this.users = data.value;
            } else {
                alert("An error occurred calling the Microsoft Graph: " + data);
            }
        });
    }
}