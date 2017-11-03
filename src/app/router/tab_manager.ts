import {NavigationExtras, Params, PathParams, QueryParams} from './pojo/params';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {RouterTab} from './router_tab';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Fragment, isUrlStateEquals, UrlParser, UrlState} from './pojo/url_state';
import {Snapshot} from './pojo/snapshot';
import {Event} from './pojo/events';

/**
 * @internal
 */
@Injectable()
export class TabsManager {

    constructor(private urlParser: UrlParser) {
    }


    public current: RouterTab;
    public tabs: RouterTab[] = [];
    public tabsSubject: Subject<RouterTab[]> = new BehaviorSubject(this.tabs);

    public eventsSubject: Subject<Event> = new Subject();
    public addTabSubject: Subject<RouterTab> = new BehaviorSubject(null);
    public switchTabSubject: Subject<number> = new BehaviorSubject(null);
    public removeTabSubject: Subject<number> = new BehaviorSubject(null);
    public navigateSubject: Subject<{ pre: UrlState, next: UrlState }> = new BehaviorSubject(null);
    public goBackSubject: Subject<{ pre: UrlState, next: UrlState }> = new BehaviorSubject(null);
    public canGoSubject: Subject<boolean> = new BehaviorSubject(false);
    public canBackSubject: Subject<boolean> = new BehaviorSubject(false);

    public params: Subject<Params> = new BehaviorSubject({});
    public pathParams: Subject<PathParams> = new BehaviorSubject({});
    public queryParams: Subject<QueryParams> = new BehaviorSubject({});
    public fragment: Subject<Fragment> = new BehaviorSubject('');

    public get snapshot(): Snapshot {
        return this.current ? this.current.snapshot : null;
    }

    addTab() {
        //add tab
        let emptyState = this.urlParser.createEmptyUrlState();
        let tab = new RouterTab(emptyState);
        this.tabs.push(tab);
        this.tabsSubject.next(this.tabs);
        this.addTabSubject.next(tab);
        //select tab
        this.selectTab(tab.tabId);
    }

    selectTab(tabId: number) {
        this.tabs.forEach((tab) => {
            if (tab.tabId == tabId) {
                tab.selected = true;
                this.current = tab;
                this.switchTabSubject.next(tabId);
            } else {
                tab.selected = false;
            }
        });
        this.tabsSubject.next(this.tabs);
        this._publishGoBackSubject();
    }

    removeTab(tabId: number) {
        if (this.tabs.length <= 1) {
            console.warn('至少保留一个tab页，不能被删除了');
            return;
        }

        let index = this.tabs.map(tab => tab.tabId).indexOf(tabId);
        let tab = this.tabs[index];
        this.tabs.splice(index, 1);
        this.tabsSubject.next(this.tabs);
        this.removeTabSubject.next(tabId);

        if (tab.selected) {
            let tab = this.tabs[this.tabs.length - 1];
            this.selectTab(tab.tabId);
        }
    }

    navigateByUrl(segments: any[] | string, extras: NavigationExtras) {
        segments = Array.isArray(segments) ? segments : [segments];

        let pre: UrlState = this.current.current;
        let next: UrlState = this.urlParser.createUrlState(segments, extras);
        if (isUrlStateEquals(pre, next)) {
            console.log('路由地址一样，不处理');
            return;
        }

        this.current.navigate(next);
        this.navigateSubject.next({pre, next});
        this._publishGoBackSubject();
    }

    canGo(): boolean {
        return this.current ? this.current.canGo() : false;
    }

    canBack(): boolean {
        return this.current ? this.current.canBack() : false;
    }

    go() {
        if (this.current) {
            let pre: UrlState = this.current.current;
            this.current.go();
            let next: UrlState = this.current.current;
            this.goBackSubject.next({pre, next});
        }
        this._publishGoBackSubject();
    }

    back() {
        if (this.current) {
            let pre: UrlState = this.current.current;
            this.current.back();
            let next: UrlState = this.current.current;
            this.goBackSubject.next({pre, next});
        }
        this._publishGoBackSubject();
    }

    private _publishGoBackSubject() {
        this.canGoSubject.next(this.canGo());
        this.canBackSubject.next(this.canBack());
    }
}