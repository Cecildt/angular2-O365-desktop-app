import { Component, View } from "angular2/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
	selector: "my-login"
})

@View({
	templateUrl: "./login/view-login.html"
})

export class Login {
	private authHelper:AuthHelper;
	constructor(auth: AuthHelper) {
		this.authHelper = auth;
	}

	login() {
		// use the AuthHelper to start the login flow
		this.authHelper.logIn();
	}
}