import { Component, AfterViewInit, OnInit } from "@angular/core";

import { ElectronService } from "../services/electron.service";
import { RuntimeInfoModel } from "../models/runtime-info.model";

declare var componentHandler: any;

@Component({
    providers: [ElectronService],
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
})
export class AppComponent implements AfterViewInit, OnInit {
    private nodeVersion: string = "";
    private chromeVersion: string = "";
    private electronVersion: string = "";

    constructor(private electronService: ElectronService) {
    }

    public ngOnInit() {
        let info: RuntimeInfoModel = this.electronService.getInfo();

        this.nodeVersion = info.nodeVersion;
        this.chromeVersion = info.chromeVersion;
        this.electronVersion = info.electronVersion;
    }

    public ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
}
