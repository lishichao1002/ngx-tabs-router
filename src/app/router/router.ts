import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params} from './pojo/params';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UrlParser, UrlState} from './pojo/url_state';

const _init_url = window.location.href;

@Injectable()
export class Router {

    // private _tabs_order: RouterTab[];
    // private _tabs: RouterTab[];
    // private _current_tab: RouterTab;
    // private _tabs_sub: Subject<RouterTab[]>;

    private _params_sub: Subject<Params>;
    private _event_sub: Subject<any>;
    private _url_sub: Subject<string>;
    private _fragment_sub: Subject<string>;

    private _cango_sub: Subject<boolean>;
    private _canback_sub: Subject<boolean>;

    constructor(private urlParser: UrlParser,
                private location: Location) {
        this._init();
    }

    private _init() {
        // this._tabs_order = [];
        // this._tabs = [];
        // this._tabs_sub = new BehaviorSubject(this._tabs);

        this._params_sub = new BehaviorSubject({});
        this._event_sub = new Subject();
        this._url_sub = new BehaviorSubject('');
        this._fragment_sub = new BehaviorSubject('');

        this._cango_sub = new BehaviorSubject(false);
        this._canback_sub = new BehaviorSubject(false);

        this._initDefaultState();
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
        // return this._tabs_sub.asObservable();
        return null;
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
        // return this._current_tab.tabId;
        return 1;
    }

    /**
     * 添加tab页
     */
    addTab(): void {
        let {queryParams, fragment} = this.urlParser.parseHref(window.location.href);
        let emptyState = this.urlParser.createEmptyUrlState(queryParams, fragment);
        let _new_tab = new RouterTab(emptyState);
        // this._tabs.push(_new_tab);
        // this._tabs_order.push(_new_tab);
        // this._tabs_sub.next(this._tabs);

        // this.selectTab(_new_tab.tabId);
    }

    /**
     * 选择tab页
     */
    selectTab(tabId: number): void {
        // let tabs = this._tabs.filter((tab) => tab.tabId == tabId);
        // if (tabs.length == 0) throw Error(`tabId(${tabId})非法`);
        //
        // this._tabs.forEach((tab) => {
        //     tab.selected = false;
        // });
        // this._current_tab = tabs[0];
        // this._current_tab.selected = true;
        // this._updateTabsOrder(this._current_tab);
        // this._tabs_sub.next(this._tabs);
        //
        // this._replaceState(this._current_tab.current);
    }

    /**
     * 删除tab页
     */
    removeTab(tabId: number): void {
        // if (this._tabs.length <= 1) throw Error(`当前只有一个tab页,不能被删除`);
        //
        // let tabs = this._tabs.filter((tab) => tab.tabId === tabId);
        // if (tabs.length === 0) throw Error(`tabId(${tabId})非法`);
        //
        // let will_deleted = tabs[0];
        // let index = this._tabs.indexOf(will_deleted);
        // this._tabs.splice(index);
        //
        // index = this._tabs_order.indexOf(will_deleted);
        // this._tabs_order.splice(index);
        //
        // let selected: RouterTab = this._tabs_order[this._tabs_order.length - 1];
        // this._tabs_sub.next(this._tabs);
        //
        // this.selectTab(selected.tabId);
    }

    private _updateTabsOrder(newTab: RouterTab) {
        // let index = this._tabs_order.indexOf(newTab);
        // this._tabs_order.splice(index).push(newTab);
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
        // let urlState: UrlState = this.urlParser.createUrlState(segments, extras);
        // this._current_tab.addRoute(urlState);
        // this._tabs_sub.next(this._tabs);
        // this._pushState(urlState);
    }


    /**
     * 是否可以前进
     */
    canGo(): boolean {
        // return this._current_tab.canGo();
        return false;
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
        // return this._current_tab.canBack();
        return false;
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
            // this._current_tab.go();
            //
            // this._replaceState(this._current_tab.current);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈顶，不能再前进了');
        }
    }

    /**
     * 后退
     */
    back(): void {
        if (this.canBack()) {
            // this._current_tab.back();
            //
            // this._replaceState(this._current_tab.current);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈底，不能再后退了');
        }
    }

    private _replaceState(urlState: UrlState) {
        Promise.resolve().then(() => {
            console.log('_replaceState');
            this.location.replaceState(urlState.href);

            // this._current_tab.outlet.destroyComponent();
            // this._current_tab.outlet.initComponent();

            this._params_sub.next({...urlState.queryParams, ...urlState.pathParams});
            this._event_sub.next(urlState.href);
            this._url_sub.next(urlState.href);
            this._fragment_sub.next(urlState.fragment);
            this._cango_sub.next(this.canGo());
            this._canback_sub.next(this.canBack());
        });
    }

    private _pushState(urlState: UrlState) {
        Promise.resolve().then(() => {
            console.log('_pushState');
            this.location.go(urlState.href);

            // this._current_tab.outlet.destroyComponent();
            // this._current_tab.outlet.initComponent();

            this._params_sub.next({...urlState.queryParams, ...urlState.pathParams});
            this._event_sub.next(urlState.href);
            this._url_sub.next(urlState.href);
            this._fragment_sub.next(urlState.fragment);
            this._cango_sub.next(this.canGo());
            this._canback_sub.next(this.canBack());
        });
    }

}