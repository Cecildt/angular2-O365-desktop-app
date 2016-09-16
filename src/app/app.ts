import { Component, AfterViewInit } from "@angular/core";
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { ElectronService } from "../services/electronService";
import { InfoModel } from "../models/infoModel";
import { Toast } from "../toast/toast"

declare var componentHandler: any;

@Component({
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
    directives: [Toast]
})
export class AppComponent implements AfterViewInit  {
    userName: string = "";
    nodeVersion: string = "";
    chromeVersion: string = "";
    electronVersion: string = "";

    constructor(electronService: ElectronService) {       
        electronService.GetInfo((info: InfoModel) => {
            this.nodeVersion = info.nodeVersion;
            this.chromeVersion = info.chromeVersion;
            this.electronVersion = info.electronVersion;
        })        
    }

    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
}
