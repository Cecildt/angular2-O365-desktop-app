import { Component, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

import { ProfileComponent } from "../profile/profile.component";
import { ElectronService } from "../services/electron.service";
import { ToastComponent } from "../toast/toast.component";

@Component({
    selector: "my-home",
    templateUrl: "src/home/view-home.html"
})
export class HomeComponent implements OnInit {

    constructor(private electron: ElectronService,
        private profile: ProfileComponent,
        private toast: ToastComponent) {
    }

    ngOnInit(){
        this.toast.show("You are authenticated!");
    }

    public signOut() {
        this.electron.logOut();
    }

    public refreshInfo() {
        this.profile.refreshInfo();
    }
}