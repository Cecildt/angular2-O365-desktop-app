import { Component } from "@angular/core";
import { NgIf } from "@angular/common";

import { Profile } from "../profile/profile";
import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";


@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html",
    directives: [NgIf, Profile]
})
export class Home {
    private authenticated: boolean = false;

    constructor(public authHelper: AuthHelper,
        public profile: Profile,
        public toast: Toast) {

        toast.show("You are authenticated!");
    }

    public signOut() {
        this.authHelper.logOut();
    }

    public refreshInfo() {
        this.profile.refreshInfo();
    }
}