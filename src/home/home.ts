import { Component } from "@angular/core";
import { Profile } from "../profile/profile";
import { AuthHelper } from "../authHelper/authHelper";

@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html",
    directives: [Profile]
})
export class Home {
    private authHelper:AuthHelper;
    private profile: Profile;

    constructor(auth: AuthHelper, profile: Profile) {
		this.authHelper = auth;
        this.profile = profile;
	}

    public signOut() {
        this.authHelper.logOut();
    }

    public refreshInfo(){
        this.profile.refreshInfo();
    }
}