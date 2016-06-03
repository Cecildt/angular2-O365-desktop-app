import { Component } from "@angular/core";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router-deprecated";

import { Profile } from "../profile/profile";
import { AuthHelper } from "../authHelper/authHelper";


@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html",
    directives: [NgIf, Profile]
})
export class Home {
    private profile: Profile;
    private authenticated: boolean = false;

    constructor(public authHelper: AuthHelper, profile: Profile, router: Router) {
        this.profile = profile;
        
        this.authenticated = this.authHelper.isUserAuthenticated();
        
        if (!this.authHelper.isUserAuthenticated) {
            router.navigate(["/Login"]);
            return;
        }
	}

    public signOut() {
        this.authHelper.logOut();
    }

    public refreshInfo(){
        this.profile.refreshInfo();
    }
}