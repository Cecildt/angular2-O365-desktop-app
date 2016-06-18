import { Component } from "@angular/core";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router-deprecated";

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
                public toast: Toast, 
                router: Router) {
        
        this.authHelper.isUserAuthenticated()
            .then(() => {
                toast.show("You are authenticated!");
            })
            .catch(() => {
                router.navigate(["/Login"]);
            });
	}

    public signOut() {
        this.authHelper.logOut();
    }

    public refreshInfo(){
        this.profile.refreshInfo();
    }
}