import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from './router';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router-tab';
import {List} from 'immutable';
import {Route} from './types';

@Component({
    selector: 'router-tabs',
    template: `
        <ng-container *ngFor="let tab of (tabs$ | async)">
            <div>
                <div style="background-color:pink;">
                    <button [class.selected]="tab.selected" (click)="selectTab(tab.tabId)">{{tab?.current?.title}}</button>
                    <button class="delete" (click)="removeTab(tab.tabId)">X</button>
                </div>
                <div style="background-color:red;">
                    <h1>{{tab.tabId}}</h1>
                    <router-tab [route]="tab.current" [class.hidden]="!tab.selected"></router-tab>
                </div>
            </div>
        </ng-container>
    `,
    styles: [`
        button {
            background-color: darkgrey;
            color: #fff;
            border: none;
            padding: 10px 20px;
        }

        .delete {
            background-color: #000;
        }

        .selected {
            background-color: yellowgreen;
        }
    `]
})
export class RouterTabsComponent implements OnInit, OnDestroy {

    tabs$: Observable<List<RouterTab>>;

    constructor(private router: Router) {
        this.tabs$ = this.router.onTabsChange;
    }

    selectTab(tabId: number) {
        this.router.selectTab(tabId);
    }

    removeTab(tabId: number) {
        this.router.removeTab(tabId);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}


@Component({
    selector: 'router-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngComponentOutlet="route?.component"></ng-container>
    `
})
export class RouterTabComponent {

    @Input() route: Route;

}