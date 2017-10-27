import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params} from './pojo/params';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isQueryParamsEquals, isUrlStateLike, UrlParser, UrlState} from './pojo/url_state';
import {RouterTabsComponent} from './directive/router-tabs.component';

const _init_url = window.location.href;

@Injectable()
export class Router {

    private _tabs_sub: Subject<RouterTab[]>;
    private _params_sub: Subject<Params>;
    private _event_sub: Subject<any>;
    private _url_sub: Subject<string>;
    private _fragment_sub: Subject<string>;

    private _cango_sub: Subject<boolean>;
    private _canback_sub: Subject<boolean>;

    constructor(private urlParser: UrlParser,
                private location: Location) {
        this._tabs_sub = new BehaviorSubject([]);
        this._params_sub = new BehaviorSubject({});
        this._event_sub = new Subject();
        this._url_sub = new BehaviorSubject(_init_url);
        this._fragment_sub = new BehaviorSubject('');

        this._cango_sub = new BehaviorSubject(false);
        this._canback_sub = new BehaviorSubject(false);
    }

    /**
     * @inner
     */
    outlets: RouterTabsComponent;

    /**
     * @inner
     */
    _init() {
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
        this.outlets.routerTabs.subscribe((tabs) => {
            this._tabs_sub.next(tabs);
        });
    }

    private _initDefaultState() {
        this.addTab();

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
        return this._tabs_sub.asObservable();
    }

    /**
     * 参数(pathParam,queryParam)改变时触发
     */
    get params(): Observable<Params> {
        return this._params_sub.asObservable();
    }

    /**
     * 路由相关的事件
     */
    get events(): Observable<any> {
        return this._event_sub.asObservable();
    }

    /**
     * url改变时触发(pathParam, queryParam, fragment)
     */
    get url(): Observable<string> {
        return this._url_sub.asObservable();
    }

    /**
     * fragment改变时触发,fragment即tabId,即用户切换tab时触发
     * @returns {null}
     */
    get fragment(): Observable<string> {
        return this._fragment_sub.asObservable();
    }

    /**
     * 参数(pathParam,queryParam)快照
     */
    get snapshot(): Params {
        let {segments, queryParams} = this.urlParser.parseHref(window.location.href);
        if (segments) {
            let {pathParams} = this.urlParser.parseRoute(segments);
            return {...queryParams, ...pathParams};
        }
        return queryParams;
    }

    /**
     * 当前的tabId
     */
    tabId(): number {
        return this.outlets.currentTab.routerTab.tabId;
    }

    /**
     * 添加tab页
     */
    addTab(): void {
        let {queryParams, fragment} = this.urlParser.parseHref(window.location.href);
        let emptyState = this.urlParser.createEmptyUrlState(queryParams, fragment);
        let _new_tab = new RouterTab(emptyState);
        this.outlets.addTab(_new_tab);
        this.selectTab(_new_tab.tabId);
    }

    /**
     * 选择tab页
     */
    selectTab(tabId: number): void {
        this.outlets.selectTab(tabId);
        this._replaceState(this.outlets.currentTab.routerTab.current, null);
    }

    /**
     * 删除tab页
     */
    removeTab(tabId: number): void {
        this.outlets.removeTab(tabId);
    }

    /**
     * 导航跳转
     */
    navigate(segments: any[] | string, extras?: NavigationExtras) {
        this.navigateByUrl(segments, extras);
    }

    /**
     * 导航跳转
     */
    navigateByUrl(segments: any[] | string, extras?: NavigationExtras) {
        let next_urlState: UrlState = this.urlParser.createUrlState(segments, extras);
        let curr_urlState: UrlState = this.urlParser.parseUrlState(window.location.href);

        if (next_urlState.href == curr_urlState.href) { //如果url相同则不跳转
            console.log('路由相同，不跳转');
            return;
        }
        if (isUrlStateLike(curr_urlState, next_urlState)) { //如果路由相同，url不同，即参数不同
            console.log('路由相同，不跳转，但要更新路由参数');
            this._replaceState(next_urlState, curr_urlState);
            return;
        }

        this.outlets.navigate(next_urlState);
        this._pushState(next_urlState, curr_urlState);
    }


    /**
     * 是否可以前进
     */
    canGo(): boolean {
        return this.outlets.currentTab.routerTab.canGo();
    }

    /**
     * 是否可以前进
     */
    get canGo$(): Observable<boolean> {
        return this._cango_sub.asObservable();
    }

    /**
     * 是否可以后退
     */
    canBack(): boolean {
        return this.outlets.currentTab.routerTab.canBack();
    }

    /**
     * 是否可以后退
     */
    get canBack$(): Observable<boolean> {
        return this._canback_sub.asObservable();
    }

    /**
     * 前进
     */
    go(): void {
        if (this.canGo()) {
            this.outlets.go();
            let curr_urlState: UrlState = this.urlParser.parseUrlState(window.location.href);
            this._replaceState(this.outlets.currentTab.routerTab.current, curr_urlState);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈顶，不能再前进了');
        }
    }

    /**
     * 后退
     */
    back(): void {
        if (this.canBack()) {
            this.outlets.back();
            let curr_urlState: UrlState = this.urlParser.parseUrlState(window.location.href);
            this._replaceState(this.outlets.currentTab.routerTab.current, curr_urlState);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈底，不能再后退了');
        }
    }

    private _replaceState(next_urlState: UrlState, curr_urlState?: UrlState) {
        window.history.replaceState(null, null, next_urlState.href);

        if (curr_urlState) {
            if (!isQueryParamsEquals(next_urlState.queryParams, curr_urlState.queryParams)) {
                this._params_sub.next({...next_urlState.queryParams, ...next_urlState.pathParams});
            }

            this._event_sub.next(next_urlState.href);

            if (next_urlState.href != curr_urlState.href) {
                this._url_sub.next(next_urlState.href);
            }

            if (next_urlState.fragment != curr_urlState.fragment) {
                this._fragment_sub.next(next_urlState.fragment);
            }
        } else {
            this._params_sub.next({...next_urlState.queryParams, ...next_urlState.pathParams});
            this._event_sub.next(next_urlState.href);
            this._url_sub.next(next_urlState.href);
            this._fragment_sub.next(next_urlState.fragment);
        }

        this._cango_sub.next(this.canGo());
        this._canback_sub.next(this.canBack());
    }

    private _pushState(next_urlState: UrlState, curr_urlState: UrlState) {
        window.history.pushState(null, null, next_urlState.href);

        if (!isQueryParamsEquals(next_urlState.queryParams, curr_urlState.queryParams)) {
            this._params_sub.next({...next_urlState.queryParams, ...next_urlState.pathParams});
        }

        this._event_sub.next(next_urlState.href);

        if (next_urlState.href != curr_urlState.href) {
            this._url_sub.next(next_urlState.href);
        }

        if (next_urlState.fragment != curr_urlState.fragment) {
            this._fragment_sub.next(next_urlState.fragment);
        }

        this._cango_sub.next(this.canGo());
        this._canback_sub.next(this.canBack());
    }

}
