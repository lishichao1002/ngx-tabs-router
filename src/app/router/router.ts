import {forwardRef, Inject, Injectable} from '@angular/core';
import {FullPathAndRoute, NavigationExtras, RelativePathAndRoute, Route, ROUTES} from './types';
import {RouterTab} from './router-tab';
import {List} from 'immutable';
import * as URI from 'urijs';
import * as pathToRegexp from 'path-to-regexp';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const baseUrl = location.protocol + '//' + location.host + '/';

const log = function (msg) {
    console.log('[Router] --> ', msg);
};

@Injectable()
export class Router {

    private _tabs_order: List<RouterTab>;
    private _tabs: List<RouterTab>;
    private _current_tab: RouterTab;
    private _default_route: Route;
    private _tabsSubject: Subject<List<RouterTab>>;
    private _canGoSubject: Subject<boolean>;
    private _canBackSubject: Subject<boolean>;

    constructor(@Inject(forwardRef(() => ROUTES)) private _routers: Route[]) {
        this._init();
    }

    private _init() {
        // this._current_tab = new RouterTab();
        // this._tabs = List([this._current_tab]);
        // this._tabs_order = List([this._current_tab]);
        this._tabs = List([]);
        this._tabs_order = List(this._tabs);
        this._tabsSubject = new BehaviorSubject<List<RouterTab>>(this._tabs);
        this._canGoSubject = new BehaviorSubject(false);
        this._canBackSubject = new BehaviorSubject(false);
        this.addTab(); // init default tab
        this._initDefaultRoute();
        window.onpopstate = this.onPopStateEvent.bind(this);
    }

    onPopStateEvent(event) {
        log(event);
        this._analysisHrefAndPushState();
    }

    get onTabsChange(): Observable<List<RouterTab>> {
        return this._tabsSubject.asObservable();
    }

    // 打开新tab页并渲染默认路由  [压栈]-[浏览器压栈]
    addTab() {
        log('addTab');

        this._tabs.forEach((tab, index) => {
            this._tabs.update(index, (value => {
                value.selected = false;
                return value;
            }));
        });
        this._current_tab = new RouterTab();
        // this._tabs = this._tabs.push(this._current_tab);
        // this._tabs_order = this._tabs_order.push(this._current_tab);
        this._tabsSubject.next(this._tabs);
        this._canGoSubject.next(this.canGo());
        this._canBackSubject.next(this.canBack());

        let uri = new URI(baseUrl).fragment(`${this._current_tab.tabId}`).toString();
        window.history.replaceState(JSON.stringify({href: uri}), null, uri);
    }

    // 选中tab页   [压栈]-[浏览器压栈]
    selectTab(tabId: number) {
        log(`select tab ${tabId}`);

        let tabs = this._tabs.filter((tab) => tab.tabId == tabId).toArray();
        if (tabs.length == 0) throw Error(`tabId(${tabId})非法`);

        this._tabs.forEach((tab, index) => {
            this._tabs.update(index, (value => {
                value.selected = false;
                return value;
            }));
        });
        this._current_tab = tabs[0];
        this._current_tab.selected = true;
        this._updateTabsOrder(this._current_tab);
        this._canGoSubject.next(this.canGo());
        this._canBackSubject.next(this.canBack());

        let href = this._current_tab.current ? this._current_tab.current.href : baseUrl;
        let query = new URI(window.location.href).query();
        let uri = new URI(href).query(query).fragment(`${this._current_tab.tabId}`).toString();
        window.history.replaceState(JSON.stringify({href: uri}), null, uri);
    }

    // 删除tab页   [清空栈]-[浏览器不压栈]
    removeTab(tabId: number) {
        if (this._tabs.size <= 1) throw Error(`当前只有一个tab页,不能被删除`);

        let tabs = this._tabs.filter((tab) => tab.tabId === tabId).toArray();
        if (tabs.length === 0) throw Error(`tabId(${tabId})非法`);

        let will_deleted = tabs[0];
        let index = this._tabs.indexOf(will_deleted);
        this._tabs = this._tabs.remove(index);

        index = this._tabs_order.indexOf(will_deleted);
        this._tabs_order = this._tabs_order.remove(index);

        let selected: RouterTab = this._tabs_order.get(this._tabs_order.size - 1);
        this._tabsSubject.next(this._tabs);
        this.selectTab(selected.tabId);
    }

    /**
     * 添加路由到堆栈中
     */
    navigateByUrl(commands: any[] | string, extras: NavigationExtras) {
        commands = Array.isArray(commands) ? commands : [commands];
        let fpr: FullPathAndRoute = this.getFullPathAndRoute(commands, extras);
        if (null === fpr) throw Error('路由不存在' + commands[0]);

        let {route, fullPath} = fpr;
        let routex = {
            ...route,
            href: fullPath
        };
        this._current_tab.addRoute(routex);
        this._canGoSubject.next(this.canGo());
        this._canBackSubject.next(this.canBack());

        window.history.pushState(JSON.stringify(routex), null, fullPath);
    }

    // 当前是否能够前进
    canGo(): boolean {
        return this._current_tab.canGo();
    }

    get canGo$(): Observable<boolean> {
        return this._canGoSubject.asObservable();
    }

    // 当前是否能够后退
    canBack(): boolean {
        return this._current_tab.canBack();
    }

    get canBack$(): Observable<boolean> {
        return this._canBackSubject.asObservable();
    }

    // 在当前tab页中前进   [不压栈]-[浏览器不压栈]
    go() {
        if (this.canGo()) {
            this._current_tab.go();
            this._canGoSubject.next(this.canGo());
            this._canBackSubject.next(this.canBack());

            window.history.replaceState(JSON.stringify(this._current_tab.current), null, this._current_tab.current.href);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈顶，不能再前进了');
        }
    }

    // 在当前tab页中后退   [不压栈]-[浏览器不压栈]
    back() {
        if (this.canBack()) {
            this._current_tab.back();
            this._canGoSubject.next(this.canGo());
            this._canBackSubject.next(this.canBack());

            window.history.replaceState(JSON.stringify(this._current_tab.current), null, this._current_tab.current.href);
        } else {
            throw Error('当前Tab的历史堆栈已经在栈底，不能再后退了');
        }
    }

    /**
     * 获取绝的地址和对应的路由
     */
    getFullPathAndRoute(commands: any[], extras?: NavigationExtras): FullPathAndRoute {
        let relativePathAndRoute: RelativePathAndRoute = this._getRelativePathAndRoute(commands);
        let relativePath = relativePathAndRoute ? relativePathAndRoute.relativePath : '';
        let url = new URI(relativePath).absoluteTo(baseUrl);

        if (extras && extras.queryParams) {
            for (let key in extras.queryParams) {
                url.setQuery(key, extras.queryParams[key]);
            }
        }

        url.fragment(`${this._current_tab.tabId}`);

        return {
            route: relativePathAndRoute ? relativePathAndRoute.route : null,
            fullPath: url.toString()
        };
    }

    /**
     * 获取相对地址和对应的路由
     */
    private _getRelativePathAndRoute(commands: any[]): RelativePathAndRoute {
        let url = commands.join('/');
        for (let i = 0; i < this._routers.length; i++) {
            let route: Route = this._routers[i];
            let regex = new RegExp(pathToRegexp(route.path));
            if (regex.test(url)) {
                let path = commands[0];
                if (commands.length > 1) {
                    let toPath = pathToRegexp.compile(route.path);
                    let params = {};
                    let tokens = pathToRegexp.parse(route.path);
                    for (let j = 0; j < tokens.length; j++) {
                        let token: any = tokens[j];
                        if (typeof token !== 'string') {
                            params[token.name] = commands[j];
                        }
                    }
                    path = toPath(params);
                }

                return {
                    route: route,
                    relativePath: path
                };
            }
        }
    }

    private _updateTabsOrder(newTab: RouterTab) {
        let index = this._tabs_order.indexOf(newTab);
        this._tabs_order = this._tabs_order.delete(index).push(newTab);
    }

    private _initDefaultRoute() {
        log('init default route');

        let routes: Route[] = this._routers.filter((route: Route) => route.default);
        if (routes.length == 1) {
            this._default_route = routes[0];
        }

        let uri = new URI(window.location.href).fragment('');
        let route_path: string = uri.path().substring(1);
        let query: any = uri.query(true);

        let fpar: FullPathAndRoute = this.getFullPathAndRoute([route_path], {
            queryParams: query
        });

        if (!fpar) {
            fpar = this.getFullPathAndRoute([this._default_route.path]);
        }

        let {fullPath, route} = fpar;
        let routex = {
            ...route,
            href: fullPath
        };
        this._current_tab.addRoute(routex);
        window.history.replaceState(JSON.stringify(routex), null, fullPath);
    }

    private _analysisHrefAndPushState() {
        let uri = new URI(window.location.href).fragment('').query('').toString();
        let query: any = new URI(window.location.href).query(true);
        let route_path = uri.substring(baseUrl.length);
        let fpar: FullPathAndRoute = this.getFullPathAndRoute([route_path], {
                queryParams: query
            }) || this.getFullPathAndRoute([this._default_route.path]);

        let {fullPath, route} = fpar;
        let routex = {
            ...route,
            href: fullPath
        };
        this._current_tab.addRoute(routex);
        window.history.replaceState(JSON.stringify(routex), null, fullPath);
    }
}