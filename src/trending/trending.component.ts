import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { GraphService } from "../services/graph.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages";
import { OFFICE_URLS } from "../office/office-urls";

@Component({
    selector: "my-trending",
    templateUrl: "src/trending/view-trending.html",
})
export class TrendingComponent implements OnInit {
    private trends = [];

    constructor(private graph: GraphService,
                private toast: ToastComponent,
                private changeRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.toast.show(USER_MESSAGES.get_trending);
        this.getTrending();
    }

    private getTrending() {
        this.graph.getRequestPromise(OFFICE_URLS.me_trending_around_url)
            .then((data: any) => {
                if (data) {
                    this.trends = data.value;
                    this.changeRef.detectChanges();
                } else {
                    this.toast.show(USER_MESSAGES.fail_graph_api);
                }
            })
            .catch(() => {
                this.toast.show(USER_MESSAGES.fail_graph_api);
            });
    }
}
