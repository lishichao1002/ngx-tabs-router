import {NavigationExtras, Params, PathParams, QueryParams} from './pojo/params';
import {Injectable, Injector} from '@angular/core';
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

    /**
     * 路由实例和tab页的映射，mode: single 时使用
     */
    private _instances: {
        [route_path: string]: {
            href: string;
            tabId: number;
        }
    } = {};

    constructor(private urlParser: UrlParser,
                private injector: Injector) {
    }

    public current: RouterTab;
    public tabs: RouterTab[] = [];
    public tabsSubject: Subject<RouterTab[]> = new BehaviorSubject(this.tabs);

    public eventsSubject: Subject<Event> = new Subject();
    public addTabSubject: Subject<{ tab: RouterTab, next: UrlState, extras: NavigationExtras }> = new BehaviorSubject(null);
    public switchTabSubject: Subject<number> = new BehaviorSubject(null);
    public removeTabSubject: Subject<number> = new BehaviorSubject(null);
    public navigateSubject: Subject<{ next: UrlState, extras: NavigationExtras }> = new BehaviorSubject(null);
    public goBackSubject: Subject<{ next: UrlState }> = new BehaviorSubject(null);
    public canGoSubject: Subject<boolean> = new BehaviorSubject(false);
    public canBackSubject: Subject<boolean> = new BehaviorSubject(false);

    public params: Subject<Params> = new BehaviorSubject({});
    public pathParams: Subject<PathParams> = new BehaviorSubject({});
    public queryParams: Subject<QueryParams> = new BehaviorSubject({});
    public fragment: Subject<Fragment> = new BehaviorSubject('');

    public get snapshot(): Snapshot {
        return this.current ? this.current.snapshot : null;
    }

    addTab(segments: any[] | string, extras: NavigationExtras) {
        //add tab
        let pre = this.urlParser.createEmptyUrlState();
        let tab = new RouterTab(pre);
        let next: UrlState = this.urlParser.createUrlState(segments, extras);
        tab.navigate(next);
        this.tabs.push(tab);
        this.selectTab(tab.tabId);
        this.tabsSubject.next(this.tabs);
        this.addTabSubject.next({tab, next, extras});
        //select tab
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

        for (let key in this._instances) {
            let instance = this._instances[key];
            if (instance && instance.tabId == tabId) {
                this._instances[key] = null;
            }
        }

        if (tab.selected) {
            let tab = this.tabs[this.tabs.length - 1];
            this.selectTab(tab.tabId);
        }
    }

    navigateByUrl(segments: any[] | string, extras: NavigationExtras, mode: 'single' | 'multiple') {
        segments = Array.isArray(segments) ? segments : [segments];

        let pre: UrlState = this.current ? this.current.current : null;
        let next: UrlState = this.urlParser.createUrlState(segments, extras);

        /** 处理重定向 */
        if (next.route && next.route.redirectTo) {
            return this.navigateByUrl(next.route.redirectTo, extras, mode);
        }

        if (isUrlStateEquals(pre, next)) {
            console.log('路由地址一样，不处理');
            return;
        }

        if (mode == 'single') { //如果是单组件模式
            let instance = this._instances[next.route.path];
            if (instance) {
                //step1: 如果之前已经实例化过了
                this.selectTab(instance.tabId);
                //step2: 如果之前实例化的组件,pathParams不一样
                if (instance.href != next.href) {
                    this.navigateSubject.next({next, extras});
                    this.current.navigate(next);
                    this._publishGoBackSubject();
                    this._instances[next.route.path] = {
                        tabId: this.current.tabId,
                        href: next.href
                    };
                }
            } else { //如果没有实例化过改组件
                this.addTab(segments, extras);
                this._instances[next.route.path] = {
                    tabId: this.current.tabId,
                    href: next.href
                };
            }
        } else { //如果是多组件模式
            if (this.current) { //如果当前有tab页
                this.navigateSubject.next({next, extras});
                this.current.navigate(next);
                this._publishGoBackSubject();
            } else { //如果当前没有tab页，创建tab
                this.addTab(segments, extras);
            }
        }
    }

    canGo(): boolean {
        return this.current ? this.current.canGo() : false;
    }

    canBack(): boolean {
        return this.current ? this.current.canBack() : false;
    }

    go() {
        if (this.current) {
            this.current.go();
            let next: UrlState = this.current.current;
            this.goBackSubject.next({next});
        }
        this._publishGoBackSubject();
    }

    back() {
        if (this.current) {
            this.current.back();
            let next: UrlState = this.current.current;
            this.goBackSubject.next({next});
        }
        this._publishGoBackSubject();
    }

    private _publishGoBackSubject() {
        this.canGoSubject.next(this.canGo());
        this.canBackSubject.next(this.canBack());
    }
}