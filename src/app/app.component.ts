import { Component, AfterViewInit, OnInit } from "@angular/core";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ElectronService } from "../services/electron.service";
import { RuntimeInfoModel } from "../models/runtime-info.model";
import { ToastComponent } from "../toast/toast.component"

declare var componentHandler: any;

@Component({
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
    providers: [ElectronService]
})
export class AppComponent implements AfterViewInit, OnInit {
    userName: string = "";
    nodeVersion: string = "";
    chromeVersion: string = "";
    electronVersion: string = "";

    constructor(private electronService: ElectronService) {
    }

    ngOnInit() {
        let info: RuntimeInfoModel = this.electronService.GetInfo();

        this.nodeVersion = info.nodeVersion;
        this.chromeVersion = info.chromeVersion;
        this.electronVersion = info.electronVersion;
    }

    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
}
