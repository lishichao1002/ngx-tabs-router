import {Injectable, Injector, Type} from '@angular/core';
import {Route, ROUTES, Routes} from './types';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class Router {

    private _routers: Routes;
    private _componentSubject: Subject<Type<any>>;

    constructor(private injector: Injector) {
        this._routers = this.injector.get(ROUTES);
        this._componentSubject = new BehaviorSubject<Type<any>>(null);
        window.onpopstate = this.onPopStateEvent.bind(this);
        this.initDefaultRouteAndComponent();
    }

    get onRouterChange(): Observable<Type<any>> {
        return this._componentSubject.asObservable();
    }

    /**
     * 路由变化 [ 前进、后退 ] 切换路由
     */
    onPopStateEvent() {
        let url = window.location.href;
        for (let i = 0; i < this._routers.length; i++) {
            let router: Route = this._routers[i];
            if (router.path && url.endsWith(router.path)) {
                this._componentSubject.next(router.component);
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
        this._componentSubject.next(defaultRoute.component);
        if (!window.location.href.endsWith(defaultRoute.path)) {
            window.history.replaceState({}, null, defaultRoute.path);
        }
    }

    /**
     * 添加路由到堆栈中
     * @param route
     */
    addRouteAndComponent(route: Route | string) {
        if (typeof route === 'string') {
            route = this._findRouteByRouterPath(route);
        }
        this._componentSubject.next(route.component);
        window.history.pushState({}, null, route.path);
    }

    private _findRouteByRouterPath(path: string): Route {
        for (let i = 0; i < this._routers.length; i++) {
            let router: Route = this._routers[i];
            if (router.path && path === router.path) {
                return router;
            }
        }

        return this._routers[0];
    }
}