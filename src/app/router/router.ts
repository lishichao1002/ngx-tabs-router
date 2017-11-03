import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params, PathParams, QueryParams} from './pojo/params';
import {Snapshot} from './pojo/snapshot';
import {TabsManager} from './tab_manager';
import {UrlParser} from './pojo/url_state';
import 'rxjs/add/observable/of';

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

    private _init_url: string = window.location.href;

    constructor(private tabsManager: TabsManager,
                private urlParser: UrlParser,
                private location: Location) {
        this._init();
    }

    private _init() {
        this.addTab();
        this._initDefaultState();
        this.location.subscribe((event: PopStateEvent) => {
            let {segments, queryParams, fragment} = this.urlParser.parseHref(window.location.href);
            this.navigate(segments, {
                queryParamsHandling: 'merge',
                queryParams: queryParams,
                preserveFragment: true,
                fragment: fragment
            });
        });
    }

    private _initDefaultState() {
        let {segments, queryParams, fragment} = this.urlParser.parseHref(this._init_url);
        this.navigateByUrl(segments, {
            fragment: fragment,
            queryParams: queryParams,
            queryParamsHandling: 'preserve',
            preserveFragment: true
        });
    }

    get tabs(): Observable<RouterTab[]> {
        return this.tabsManager.tabsEvent.asObservable();
    }

    get tab(): RouterTab {
        return this.tabsManager.current;
    }

    addTab() {
        this.tabsManager.addTab();
    }

    selectTab(tabId: number) {
        this.tabsManager.selectTab(tabId);
    }

    removeTab(tabId: number) {
        this.tabsManager.removeTab(tabId);
    }

    navigate(segments: any[] | string, extra: NavigationExtras) {
        this.navigateByUrl(segments, extra);
    }

    navigateByUrl(segments: any[] | string, extras: NavigationExtras) {
        this.tabsManager.navigateByUrl(segments, extras);
    }

    get params(): Observable<Params> {
        return this.tabsManager.params.asObservable();
    }

    get pathParams(): Observable<PathParams> {
        return this.tabsManager.pathParams.asObservable();
    }

    get queryParams(): Observable<QueryParams> {
        return this.tabsManager.queryParams.asObservable();
    }

    get fragment(): Observable<string> {
        return this.tabsManager.fragment.asObservable();
    }

    get snapshot(): Snapshot {
        return this.tabsManager.snapshot;
    }

    canGo(): boolean {
        return this.tabsManager.canGo();
    }

    canBack(): boolean {
        return this.tabsManager.canBack();
    }

    get canGo$(): Observable<boolean> {
        return this.tabsManager.canGoSubject.asObservable();
    }

    get canBack$(): Observable<boolean> {
        return this.tabsManager.canBackSubject.asObservable();
    }

    go(): void {
        this.tabsManager.go();
    }

    back(): void {
        this.tabsManager.back();
    }
}
