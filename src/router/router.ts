import {Compiler, Injectable, Injector, NgModuleFactoryLoader} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RouterTab} from './router_tab';
import {NavigationExtras, Params, PathParams, QueryParams} from './pojo/params';
import {Snapshot} from './pojo/snapshot';
import {TabsManager} from './tab_manager';
import {UrlParser} from './pojo/url_state';
import {Event} from './pojo/events';
import 'rxjs/add/observable/of';
import {ITitle, Route} from './pojo/route';
import {RouterConfigLoader} from './async_router_loader';

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
    private _mode: 'single' | 'multiple';
    public configLoader: RouterConfigLoader;

    constructor(private tabsManager: TabsManager,
                private urlParser: UrlParser,
                private injector: Injector,
                private location: Location,
                private loader: NgModuleFactoryLoader,
                private compiler: Compiler) {
        this._init();
        this.configLoader = new RouterConfigLoader(loader, compiler);
    }

    private _init() {
        this._mode = <any>window.localStorage.getItem('router_mode') || 'multiple';
        this._initDefaultState();
        this.location.subscribe((event: PopStateEvent) => {
            let {segments, queryParams, fragment} = this.urlParser.parseHref(window.location.href);
            this.navigate(segments, {
                queryParamsHandling: 'merge',
                queryParams: queryParams,
                preserveFragment: true,
                fragment: fragment,
                replaceUrl: true
            });
        });
    }

    private _initDefaultState() {
        let {segments, queryParams, fragment} = this.urlParser.parseHref(this._init_url);
        this.navigateByUrl(segments, {
            fragment: fragment,
            queryParams: queryParams,
            queryParamsHandling: 'preserve',
            preserveFragment: true,
            replaceUrl: true
        });
    }

    get mode() {
        return this._mode;
    }

    set mode(_mode: 'single' | 'multiple') {
        window.localStorage.setItem('router_mode', _mode);
        window.location.reload();
    }

    get tabs(): Observable<RouterTab[]> {
        return this.tabsManager.tabsSubject.asObservable();
    }

    get tab(): RouterTab {
        return this.tabsManager.current;
    }

    /**
     * 1.创建tab组件
     * 2.广播add tab事件
     * 3.更新url地址
     * 4.创建路由组件
     * 5.广播url change事件
     * 6.广播全局param change事件
     * 7.广播tab内param change事件
     */
    addTab(segments: any[] | string, extras: NavigationExtras = {}) {
        this.tabsManager.addTab(segments, extras);
    }

    /**
     * 1.切换tab组件
     * 2.更新url地址
     * 3.广播切换tab事件
     * 4.广播url change事件
     * 5.广播全局param change事件
     */
    selectTab(tabId: number) {
        this.tabsManager.selectTab(tabId);
    }

    /**
     * 1.删除当前tab
     * 2.广播删除tab事件
     * 3.选中上个tab
     * 4.更新url地址
     * 5.广播切换tab事件
     * 6.广播url change事件
     * 7.广播全局param change事件
     */
    removeTab(tabId: number) {
        this.tabsManager.removeTab(tabId);
    }

    /**
     * 1.创建路由组件
     * 2.更新url地址
     * 3.广播url change事件
     * 4.广播局部url change事件
     * 5.广播全局param change事件
     */
    navigate(segments: any[] | string, extra: NavigationExtras) {
        this.navigateByUrl(segments, extra);
    }

    /**
     * 见@navigate
     */
    navigateByUrl(segments: any[] | string, extras: NavigationExtras) {
        this.tabsManager.navigateByUrl(segments, extras, this.mode);
    }

    get events(): Observable<Event> {
        return this.tabsManager.eventsSubject.asObservable();
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

    /**
     * 见@navigate
     */
    go(): void {
        this.tabsManager.go();
    }

    back(): void {
        this.tabsManager.back();
    }

    /**
     * 见@navigate
     */
    getTitle(route: Route, tab: RouterTab): string {
        if (route) {
            if (route.title) {
                let title = route.title;
                if (typeof title == 'string') {
                    return title;
                } else {
                    let iTitle: ITitle = this.injector.get(title);
                    return iTitle.getTitle(route, tab);
                }
            }
            return '该路由未设置title';
        } else {
            return '空路由';
        }
    }
}
