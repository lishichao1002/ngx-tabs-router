import {forwardRef, Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params} from './pojo/params';
import {Route, ROUTES} from './pojo/route';
import {LocationStrategy} from '@angular/common';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const _init_url = window.location.href;

@Injectable()
export class Router {

    private _tabs_order: RouterTab[];
    private _tabs: RouterTab[];
    private _current_tab: RouterTab[];

    private _tabs_sub: Subject<RouterTab[]>;
    private _params_sub: Subject<Params>;
    private _event_sub: Subject<any>;
    private _url_sub: Subject<string>;
    private _fragment_sub: Subject<string>;

    private _cango_sub: Subject<boolean>;
    private _canback_sub: Subject<boolean>;

    private _base_url: string;

    constructor(@Inject(forwardRef(() => ROUTES))
                private routers: Route[],
                private locationStrategy: LocationStrategy,
                private location: Location) {
        this._init();
    }

    private _parseInitState() {

    }

    private _init() {
        this._tabs_order = [];
        this._tabs = [];

        this._tabs_sub = new BehaviorSubject(this._tabs);
        this._params_sub = new BehaviorSubject({});
        this._event_sub = new Subject();
        this._url_sub = new BehaviorSubject('');
        this._fragment_sub = new BehaviorSubject('');

        this._cango_sub = new BehaviorSubject(false);
        this._canback_sub = new BehaviorSubject(false);

        this._base_url = this.locationStrategy.getBaseHref();
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
        return null;
    }

    /**
     * 当前的tabId
     */
    tabId(): number {
        return null;
    }

    /**
     * 添加tab页
     */
    addTab(): void {

    }

    /**
     * 选择tab页
     */
    selectTab(tabId: number): void {

    }

    /**
     * 删除tab页
     */
    removeTab(tabId: number): void {

    }

    /**
     * 导航跳转
     */
    navigate(commands: any[] | string, extras?: NavigationExtras) {

    }

    /**
     * 导航跳转
     */
    navigateByUrl(commands: any[] | string, extras?: NavigationExtras) {

    }


    /**
     * 是否可以前进
     */
    canGo(): boolean {
        return null;
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
        return null;
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
        return null;
    }

    /**
     * 后退
     */
    back(): void {
        return null;
    }

}