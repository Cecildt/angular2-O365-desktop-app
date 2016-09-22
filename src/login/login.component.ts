import { Component } from "@angular/core";

import { ElectronService } from "../services/electron.service";

@Component({
	selector: "my-login",
	templateUrl: "src/login/view-login.html"
})
export class LoginComponent {
	constructor(private electronService: ElectronService) {
	}

	login() {
		this.electronService.logIn2();
	}
}