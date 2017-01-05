import { Component } from "@angular/core";

import { ElectronService } from "../services/electron.service";

@Component({
    selector: "my-login",
    templateUrl: "src/login/view-login.html",
})
export class LoginComponent {
    constructor(private electronService: ElectronService) {
    }

    public login() {
        // Clear local cache
        window.localStorage.removeItem("id_token");
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("user");

        this.electronService.logIn();
    }
}
