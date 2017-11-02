import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params, PathParams, QueryParams} from './pojo/params';
import {Snapshot} from './pojo/snapshot';
import {TabsEvent} from './events';
import {UrlParser, UrlState} from './pojo/url_state';
import 'rxjs/add/observable/of';

const _init_url = window.location.href;

/**
 //tabs
 router.tabs
 router.addTab
 router.selectTab
 router.removeTab
 router.navigate
 router.navigateByUrl

 //所有tab的参数变化都会触发这些事件
 router.params
 router.pathParams
 router.queryParams
 router.fragment

 //快照
 router.snapshot.params
 router.snapshot.pathParams
 router.snapshot.queryParams
 router.snapshot.fragment

 //会触发当前tab的前进后退
 router.canGo
 router.go
 router.canBack
 router.back

 //tab页内跳转 或 tab页间切换 时会刷新前进后退
 router.canGo$
 router.canBack$
 */
@Injectable()
export class Router {

    constructor(public tabsEvent: TabsEvent,
                public urlParser: UrlParser,
                public location: Location) {
        this._init();
    }

    private _init() {
        this.addTab();
        this._initDefaultState();
        this.location.subscribe((event: PopStateEvent) => {
            let urlState: UrlState = this.urlParser.parseUrlState(window.location.href);
            this.navigate(urlState.segments, {
                queryParamsHandling: 'merge',
                queryParams: urlState.queryParams,
                preserveFragment: true,
                fragment: urlState.fragment
            });
        });
    }

    private _initDefaultState() {
        let init_state: UrlState = this.urlParser.parseUrlState(_init_url);
        if (init_state) {
            let {segments, queryParams, fragment} = this.urlParser.parseHref(_init_url);
            this.navigateByUrl(segments, {
                fragment: fragment,
                queryParams: queryParams,
                queryParamsHandling: 'preserve',
                preserveFragment: true
            });
        }
    }

    get tabs(): Observable<RouterTab[]> {
        return this.tabsEvent.tabsEvent.asObservable();
    }

    get tab(): RouterTab {
        return this.tabsEvent.current;
    }

    addTab() {
        this.tabsEvent.addTab();
    }

    selectTab(tabId: number) {
        this.tabsEvent.selectTab(tabId);
    }

    removeTab(tabId: number) {
        this.tabsEvent.removeTab(tabId);
    }

    navigate(segments: any[] | string, extra: NavigationExtras) {
        this.navigateByUrl(segments, extra);
    }

    navigateByUrl(segments: any[] | string, extras: NavigationExtras) {
        this.tabsEvent.navigateByUrl(segments, extras);
    }

    get params(): Observable<Params> {
        return this.tabsEvent.params.asObservable();
    }

    get pathParams(): Observable<PathParams> {
        return this.tabsEvent.pathParams.asObservable();
    }

    get queryParams(): Observable<QueryParams> {
        return this.tabsEvent.queryParams.asObservable();
    }

    get fragment(): Observable<string> {
        return this.tabsEvent.fragment.asObservable();
    }

    get snapshot(): Snapshot {
        return this.tabsEvent.snapshot;
    }

    canGo(): boolean {
        return this.tabsEvent.canGo();
    }

    canBack(): boolean {
        return this.tabsEvent.canBack();
    }

    get canGo$(): Observable<boolean> {
        return this.tabsEvent.canGoSubject.asObservable();
    }

    get canBack$(): Observable<boolean> {
        return this.tabsEvent.canBackSubject.asObservable();
    }

    go(): void {
        this.tabsEvent.go();
    }

    back(): void {
        this.tabsEvent.back();
    }
}
