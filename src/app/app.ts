import { Component, AfterViewInit, OnInit } from "@angular/core";
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { ElectronService } from "../services/electron.service";
import { InfoModel } from "../models/infoModel";
import { ToastComponent } from "../toast/toast.component"

declare var componentHandler: any;

@Component({
    selector: "graph-app",
    templateUrl: "src/app/view-main.html",
    directives: [ToastComponent],
    providers:[ElectronService]
})
export class AppComponent implements AfterViewInit, OnInit  {
    userName: string = "";
    nodeVersion: string = "";
    chromeVersion: string = "";
    electronVersion: string = "";

    constructor(private electronService: ElectronService) {       
                
    }

    ngOnInit(){
        this.electronService.GetInfo().then((info: InfoModel) => {
            this.nodeVersion = info.nodeVersion;
            this.chromeVersion = info.chromeVersion;
            this.electronVersion = info.electronVersion;
        });
    }

    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
}
