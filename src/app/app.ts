import { Component, AfterViewInit } from "@angular/core";
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { InfoModel } from "../models/infoModel";
import { Toast } from "../toast/toast"
import { routing } from '../routes/app.routes';

declare var componentHandler: any;

@Component({
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
    directives: [Toast]
})
@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
})
export class App implements AfterViewInit  {
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
