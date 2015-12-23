import { Component } from "angular2/core";
import { Profile } from "../profile/profile";

@Component({
    selector: "my-home",
    templateUrl: "./home/view-home.html",
    directives: [Profile]
})
export class Home {

    public signOut() {
        window.localStorage.removeItem("id_token");
        window.localStorage.removeItem("access_token");

        window.location.reload();
    }
}