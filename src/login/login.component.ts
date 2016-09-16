import { Component } from "@angular/core";

import { AuthService } from "../auth/auth.service";

@Component({
	selector: "my-login",
	templateUrl: "src/login/view-login.html"
})
export class LoginComponent {
	constructor(private auth: AuthService) {
	}

	login() {
		// use the AuthHelper to start the login flow
		this.auth.logIn();
	}
}