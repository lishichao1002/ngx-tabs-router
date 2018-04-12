import {LoadedRouterConfig, Route} from './route';
import * as URI from 'urijs';
import * as pathToRegexp from 'path-to-regexp';
import {NavigationExtras, Params, PathParams, QueryParams} from './params';
import {Compiler, forwardRef, Inject, Injectable, Injector, NgModuleFactoryLoader, NgModuleRef} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {RouterConfigLoader} from '../async_router_loader';
import {ROUTES} from '@angular/router';

export type UrlSegment = string;
export type Fragment = string;

export class UrlState {
    constructor(/** <base href=''/> */
                public baseUrl: string,
                public route: Route,
                /** The segment group of the URL tree */
                public segments: UrlSegment[],
                public pathParams: PathParams,
                /** The query params of the URL */
                public queryParams: QueryParams,
                /** The fragment of the URL */
                public fragment: Fragment,
                public href: string) {
    }

    toString() {
        return this.href;
    }
}

/**
 * @internal
 */
@Injectable()
export class UrlParser {

    private _base_url: string;
    private routers: Route[];

    constructor(@Inject(forwardRef(() => ROUTES))
                private routeres: Route[][],
                private injector: Injector,
                private loader: NgModuleFactoryLoader,
                private compiler: Compiler,
                private locationStrategy: LocationStrategy) {
        this._base_url = this.locationStrategy.getBaseHref();
        this.routers = this.routeres[0];
    }

    createUrlHref(segments: any[] | string, extras: NavigationExtras): string {
        let {queryParams: curr_queryParams, fragment: curr_fragment} = this.parseHref(window.location.href);
        let dist_param: QueryParams = {}, dist_fragment = '';

        if (extras && !extras.queryParamsHandling) {
            dist_param = extras.queryParams;
        } else if (extras && extras.queryParamsHandling == 'merge') {
            dist_param = {...curr_queryParams, ...extras.queryParams};
        } else if (extras && extras.queryParamsHandling == 'preserve') {
            dist_param = curr_queryParams;
        }

        if (extras && !extras.preserveFragment) {
            dist_fragment = extras.fragment;
        } else if (extras && extras.preserveFragment) {
            dist_fragment = curr_fragment || extras.fragment;
        }

        let path = Array.isArray(segments) ? segments.join('/') : segments;
        let uri = new URI(path || '').query(dist_param || {}).fragment(dist_fragment || '');
        return `${this._base_url}${uri.toString()}`;
    }

    createUrlState(_segments: any[] | string, extras: NavigationExtras): Promise<UrlState> {
        return new Promise((resolve, reject) => {
            let segments: any[] = Array.isArray(_segments) ? _segments : [_segments];
            this.parseRoute(segments).then((parse_result: { route: Route, pathParams: PathParams }) => {
                if (!parse_result) throw Error(`路由不存在, ${segments.join('/')}`);

                const {queryParams: curr_queryParams, fragment: curr_fragment} = this.parseHref(window.location.href);

                const {route: dist_route, pathParams: dist_pathParams} = parse_result;

                let dist_param: QueryParams = {}, dist_fragment = '';

                if (extras && !extras.queryParamsHandling) {
                    dist_param = extras.queryParams;
                } else if (extras && extras.queryParamsHandling == 'merge') {
                    dist_param = {...curr_queryParams, ...extras.queryParams};
                } else if (extras && extras.queryParamsHandling == 'preserve') {
                    dist_param = curr_queryParams;
                }

                if (extras && !extras.preserveFragment) {
                    dist_fragment = extras.fragment;
                } else if (extras && extras.preserveFragment) {
                    dist_fragment = curr_fragment || extras.fragment;
                }
                return resolve(this.buildUrlState(dist_route, segments, dist_pathParams, dist_param, dist_fragment));
            });
        });
    }

    buildUrlState(route: Route, segments: UrlSegment[], pathParams: PathParams, queryParams: QueryParams = {}, fragment: string = ''): UrlState {
        let path = segments.join('/');
        let uri = new URI(path).query(queryParams).fragment(fragment);
        path = uri.toString();
        path = path.startsWith('/') ? path.substring(1) : path;
        return new UrlState(this._base_url, route, segments, pathParams, queryParams, fragment, `${window.location.origin}${this._base_url}${path}`);
    }

    createEmptyUrlState(): UrlState {
        let {queryParams, fragment} = this.parseHref(window.location.href);
        let href = this.emptyRouteUrl('/', queryParams, fragment);
        return new UrlState(this._base_url, null, null, {}, queryParams, fragment, href);
    }

    createInitUrlState(): UrlState {
        let href = this.emptyRouteUrl('/', {}, '');
        return new UrlState(this._base_url, null, null, {}, {}, '', href);
    }

    /**
     * 解析绝对路径 href
     */
    parseHref(href: string): { segments: UrlSegment[], queryParams: QueryParams, fragment: string } {
        let uri = new URI(href).relativeTo(this._base_url);
        const segments: UrlSegment[] = this.segments(href);
        const queryParams: QueryParams = uri.query(true);
        const fragment: string = uri.fragment();
        return {
            segments,
            queryParams,
            fragment
        };
    }

    parseRoute(segments: UrlSegment[]): Promise<{ route: Route, pathParams: PathParams }> {
        return new Promise((resolve, reject) => {
            let path = segments.join('/');
            path = path.startsWith('/') ? path.substring(1) : path;
            let matches = this.routers.filter((route: Route) => new RegExp(pathToRegexp(route.path)).test(path));
            if (matches.length > 0) {
                let route = matches[0];
                if (route.loadChildren) {
                    let ngModule = this.injector.get(NgModuleRef);
                    new RouterConfigLoader(this.loader, this.compiler)
                        .load(ngModule.injector, route)
                        .subscribe((config: LoadedRouterConfig) => {
                            this.mergeAsyncRoute(route, config);
                            console.info('加载异步路由: ', config);
                            console.info('加载异步路后的路由配置为: ', this.routers);
                            resolve(this.parseRoute(segments));
                        });
                } else {
                    let keys = [];
                    let regexp = pathToRegexp(route.path, keys, {sensitive: true, strict: true});
                    let pathParams: any = {};
                    if (keys.length > 0) {
                        let result = regexp.exec(path);
                        for (let j = 0; j < keys.length; j++) {
                            pathParams[keys[j].name] = result[j + 1];
                        }
                    }
                    resolve({
                        route: route,
                        pathParams
                    });
                }
            } else {
                reject();
            }
        });
    }

    emptyRouteUrl(segments: string[] | string, queryParams: QueryParams, fragment: string): string {
        segments = Array.isArray(segments) ? segments : [segments];
        return new URI().relativeTo(this._base_url).segment(segments).query(queryParams).fragment(fragment).toString();
    }

    segments(href: string): string[] {
        let uri1 = new URI(href);
        let path1 = uri1.path();
        if (path1.startsWith(this._base_url)) {
            let path2 = path1.substr(this._base_url.length);
            return new URI(path2).segment();
        } else {
            return uri1.segment();
        }
    }

    mergeAsyncRoute(parentRoute: Route, asyncRouteConfig: LoadedRouterConfig) {
        let idx = this.routers.indexOf(parentRoute);
        let asyncChildRoutes: Route[] = asyncRouteConfig.routes.map((subRoute: Route) => {
            return {
                ...subRoute,
                _config: asyncRouteConfig,
                path: [parentRoute.path, subRoute.path].join('')
            };
        });
        this.routers.splice(idx, 1, ...asyncChildRoutes);
    }
}


export function isUrlStateEquals(s1: UrlState, s2: UrlState): boolean {
    if (!s1 || !s2) {
        return false;
    }
    return s1.href == s2.href;
}

export function isUrlStateLike(s1: UrlState, s2: UrlState): boolean {
    if (!s1 || !s2 || !s1.route || !s2.route) {
        return false;
    }
    return s1.route.title == s2.route.title && s1.route.component == s2.route.component && s1.route.path == s2.route.path && s1.href != s2.href;
}

export function isParamsEquals(p1: Params, p2: Params): boolean {
    function p1EqP2(p1: Params, p2: Params) {
        for (let key in p1) {
            if (p2[key] != p1[key]) return false;
        }
        return true;
    }

    if (!p1 || !p2) {
        return false;
    }

    return p1EqP2(p1, p2) && p1EqP2(p2, p1);
}