import { Component } from "@angular/core";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
	selector: "my-login",
	templateUrl: "src/login/view-login.html"
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