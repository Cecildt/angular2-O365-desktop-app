import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-users",
    templateUrl: "src/users/view-users.html",
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