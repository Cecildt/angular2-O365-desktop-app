import { Component, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

import { Profile } from "../profile/profile";
import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";


@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html"
})
export class HomeComponent implements OnInit {

    constructor(private auth: AuthService,
        private profile: Profile,
        private toast: ToastComponent) {        
    }

    ngOnInit(){
        this.toast.show("You are authenticated!");
    }

    public signOut() {
        this.auth.logOut();
    }

    public refreshInfo() {
        this.profile.refreshInfo();
    }
}