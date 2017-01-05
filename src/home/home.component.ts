import { Component } from "@angular/core";

import { ProfileComponent } from "../profile/profile.component";
import { ElectronService } from "../services/electron.service";

@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html",
})
export class HomeComponent {

    constructor(private electron: ElectronService,
                private profile: ProfileComponent) {
    }

    public signOut() {
        this.electron.logOut();
    }

    public refreshInfo() {
        this.profile.refreshInfo();
    }
}
