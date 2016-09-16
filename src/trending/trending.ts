import { Component } from "@angular/core";

import { AuthHelper } from "../authHelper/authHelper";
import { Toast } from "../toast/toast";
import { UserMessages } from "../messages/messages";

@Component({
    selector: "my-trending",
    templateUrl: "src/trending/view-trending.html",
})
export class Trending {
    private trends = [];

    constructor(public authHelper: AuthHelper,
        public toast: Toast) {

        this.toast.show(UserMessages.get_trending);
                this.getTrending();
    }

    private getTrending() {
        this.authHelper.getRequestPromise("/beta/me/trendingAround")
            .then((data: any) => {
                if (data) {
                    this.trends = data.value;
                } else {
                    this.toast.show(UserMessages.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(UserMessages.fail_graph_api);
            });
    }
}