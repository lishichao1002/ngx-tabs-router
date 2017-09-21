import {forwardRef, Inject, Injectable} from '@angular/core';
import {FullPathAndRoute, NavigationExtras, RelativePathAndRoute, Route, ROUTES} from './types';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as URI from 'urijs';
import * as pathToRegexp from 'path-to-regexp';

@Injectable()
export class Router {

    private _componentSubject: Subject<Route>;
    private _baseUrl: string;

    constructor(@Inject(forwardRef(() => ROUTES)) private _routers: Route[]) {
        this._componentSubject = new BehaviorSubject<Route>(null);
        this._baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        this.initDefaultRouteAndComponent();
        window.onpopstate = this.onPopStateEvent.bind(this);
    }

    get onRouterChange(): Observable<Route> {
        return this._componentSubject.asObservable();
    }

    /**
     * 路由变化 [ 前进、后退 ] 切换路由
     */
    onPopStateEvent() {
        let url = window.location.href;
        for (let i = 0; i < this._routers.length; i++) {
            let route: Route = this._routers[i];
            if (route.path && url.endsWith(route.path)) {
                this._componentSubject.next(route);
                return;
            }
        }

        //如果所有配置的路由都找不到就跳转到默认路由
        this.initDefaultRouteAndComponent();
    }

    /**
     * 初始化默认的路由
     */
    initDefaultRouteAndComponent() {
        let defaultRoute: Route = this._routers[0];
        this._componentSubject.next(defaultRoute);
        if (!window.location.href.endsWith(defaultRoute.path)) {
            window.history.replaceState({}, null, defaultRoute.path);
        }
    }

    /**
     * 添加路由到堆栈中
     */
    navigateByUrl(commands: any[], extras: NavigationExtras) {
        let fpr: FullPathAndRoute = this.getFullPathAndRoute(commands, extras);
        this._componentSubject.next(fpr.route);
        window.history.pushState({}, null, fpr.fullPath);
    }

    /**
     * 获取绝的地址和对应的路由
     */
    getFullPathAndRoute(commands: any[], extras: NavigationExtras): FullPathAndRoute {
        let relativePathAndRoute: RelativePathAndRoute = this.getRelativePathAndRoute(commands);
        let url = new URI(relativePathAndRoute.relativePath).absoluteTo(this._baseUrl);

        if (extras && extras.queryParams) {
            for (let key in extras.queryParams) {
                url.setQuery(key, extras.queryParams[key]);
            }
        }

        if (extras && extras.fragment) {
            url.fragment(extras.fragment);
        }

        return {
            route: relativePathAndRoute.route,
            fullPath: url.toString()
        };
    }

    /**
     * 获取相对地址和对应的路由
     */
    getRelativePathAndRoute(commands: any[]): RelativePathAndRoute {
        let url = commands.join('/');
        for (let i = 0; i < this._routers.length; i++) {
            let route: Route = this._routers[i];
            let regex = new RegExp(pathToRegexp(route.path));
            if (regex.test(url)) {
                let toPath = pathToRegexp.compile(route.path);
                let params = {};
                let tokens = pathToRegexp.parse(route.path);
                for (let j = 0; j < tokens.length; j++) {
                    let token: any = tokens[j];
                    if (typeof token !== 'string') {
                        params[token.name] = commands[j];
                    }
                }
                let path = toPath(params);
                return {
                    route: route,
                    relativePath: path
                };
            }
        }

        throw Error('没有匹配的路由' + commands.join(','));
    }
}