import {Component} from '@angular/core';
import {Router} from '../router/router';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from '../router/router_tab';

@Component({
    selector: 'router-nav',
    template: `
        <div class="row" style="margin:20px;">

            <button class="btn btn-primary btn-xs" (click)="addTab()">add tab</button>

            <button *ngIf="canGo$ | async" class="btn btn-primary btn-xs" (click)="go()">Go</button>
            <button *ngIf="!(canGo$ | async)" class="btn btn-primary btn-xs disabled">Go</button>

            <button *ngIf="(canBack$ | async)" class="btn btn-primary btn-xs" (click)="back()">Back</button>
            <button *ngIf="!(canBack$ | async)" class="btn btn-primary btn-xs disabled">Back</button>

        </div>
        <div class="row" style="margin:20px;">
            <div class="btn-group" *ngFor="let tab of tabs$ | async">
                <button class="btn btn-success btn-sm"
                        [ngClass]="{'btn-danger': tab.selected}"
                        (click)="selectTab(tab.tabId)">
                    {{tab.tabId}}
                </button>
                <button class="btn btn-success btn-sm"
                        (click)="removeTab(tab.tabId)"
                        [ngClass]="{'btn-danger': tab.selected}">
                    <i class="glyphicon glyphicon-remove"></i>
                </button>
            </div>

        </div>
    `
})
export class RouterNavComponent {

    canGo$: Observable<boolean>;
    canBack$: Observable<boolean>;

    tabs$: Observable<RouterTab[]>;

    constructor(private router: Router) {
        this.canGo$ = this.router.canGo$;
        this.canBack$ = this.router.canBack$;
        this.tabs$ = this.router.tabs;
    }

    go() {
        this.router.go();
    }

    back() {
        this.router.back();
    }

    addTab() {
        this.router.addTab();
    }

    selectTab(tabId: number) {
        this.router.selectTab(tabId);
    }

    removeTab(tabId: number) {
        this.router.removeTab(tabId);
    }
}