import {Injectable} from '@angular/core';
import {Route, TabRoute} from './types';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router} from './router';
import {Subscription} from 'rxjs/Subscription';

let tabId: number = 0;

@Injectable()
export class TabsStore {

    private _tabs: TabRoute[] = [{current: true, route: null, tabId: ++tabId}]; //初始化一个
    private _tabsSubject: Subject<TabRoute[]>;
    private _currentTabRoute: TabRoute;
    private _routerSubscribe: Subscription;

    constructor(public router: Router) {
        this._currentTabRoute = this._tabs[0];
        this._tabsSubject = new BehaviorSubject<TabRoute[]>(this._tabs);
        this._routerSubscribe = this.router.onRouterChange.subscribe((route: Route) => {
            if (this._currentTabRoute) {
                this._currentTabRoute.route = route;
            }
        });
    }

    get onTabsChange(): Observable<TabRoute[]> {
        return this._tabsSubject.asObservable();
    }

    addTab() {
        this._currentTabRoute = {
            current: true,
            route: null,
            tabId: ++tabId
        };

        this._tabs = this._tabs.map((tab) => {
            return tab.current ? {...tab, current: false} : tab;
        });

        this._tabs.push(this._currentTabRoute);
        this._tabsSubject.next(this._tabs);
    }

    selectTab(tabId: number) {

    }
}