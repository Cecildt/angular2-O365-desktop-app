import { Component } from "angular2/core";
import { Profile } from "../profile/profile";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-home",
    templateUrl: "./home/view-home.html",
    directives: [Profile]
})
export class Home {
    private authHelper:AuthHelper;

    constructor(auth: AuthHelper) {
		this.authHelper = auth;
	}

    public signOut() {
        this.authHelper.logOut();
    }
}