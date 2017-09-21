import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from './router';
import {TabsStore} from './tabs';

let tabId: number = 0;

@Component({
    selector: 'tabs-router',
    template: `
        <ng-container *ngFor="let tab of (tabsStore.onTabsChange | async)">
            <tab-router [component]="tab.route?.component" [tabId]="tab.tabId" [class.hidden]="!tab.current"></tab-router>
        </ng-container>
    `
})
export class TabsRouterComponent implements OnInit, OnDestroy {

    constructor(public router: Router,
                public tabsStore: TabsStore) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}