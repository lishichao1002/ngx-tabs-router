import {Component} from '@angular/core';
import {Router} from '../router';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from '../router_tab';

@Component({
    selector: 'router-tabs',
    template: `
        <ng-container *ngFor="let tab of (tabs$ | async)">
            <router-tab [route]="tab.current" [class.hidden]="!tab.selected"></router-tab>
        </ng-container>
    `
})
export class RouterTabsComponent {

    tabs$: Observable<RouterTab[]>;

    constructor(private router: Router) {
        this.tabs$ = this.router.tabs;
    }
}