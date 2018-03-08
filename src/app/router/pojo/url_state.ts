import {Route, ROUTES} from './route';
import * as URI from 'urijs';
import * as pathToRegexp from 'path-to-regexp';
import {NavigationExtras, Params, PathParams, QueryParams} from './params';
import {forwardRef, Inject, Injectable} from '@angular/core';
import {LocationStrategy} from '@angular/common';

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

    constructor(@Inject(forwardRef(() => ROUTES))
                private routers: Route[],
                private locationStrategy: LocationStrategy) {
        this._base_url = this.locationStrategy.getBaseHref();
    }

    /**
     * 解析绝对路径 href
     */
    parseUrlState(href: string): UrlState {
        const uri = new URI(href).relativeTo(this._base_url);
        const segments: UrlSegment[] = this.segments(href);
        const queryParams: QueryParams = uri.query(true);
        const fragment: string = uri.fragment();
        const {route, pathParams} = this.parseRoute(segments) || {route: null, pathParams: null};
        return route ? new UrlState(this._base_url, route, segments, pathParams, queryParams, fragment, href) : null;
    }

    createUrlState(segments: any[] | string, extras: NavigationExtras): UrlState {
        segments = Array.isArray(segments) ? segments : [segments];
        const parse_result = this.parseRoute(segments);
        if (!parse_result) throw Error(`路由不存在, ${segments.join('/')}`);

        const {queryParams: curr_queryParams, fragment: curr_fragment} = this.parseHref(window.location.href);

        const {route: dist_route, pathParams: dist_pathParams} = parse_result;

        let dist_param: QueryParams, dist_fragment;

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

        return this.buildUrlState(dist_route, segments, dist_pathParams, dist_param, dist_fragment);
    }

    buildUrlState(route: Route, segments: UrlSegment[], pathParams: PathParams, queryParams: QueryParams = {}, fragment: string = ''): UrlState {
        let path = segments.join('/');
        path = path.startsWith('/') ? path.substring(1) : path;
        let uri = new URI(path).absoluteTo(`${window.location.origin}${this._base_url}`).query(queryParams).fragment(fragment);
        return new UrlState(this._base_url, route, segments, pathParams, queryParams, fragment, uri.toString());
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

    parseRoute(segments: UrlSegment[]): { route: Route, pathParams: PathParams } {
        let path = segments.join('/');
        path = path.startsWith('/') ? path.substring(1) : path;
        for (let i = 0; i < this.routers.length; i++) {
            let route: Route = this.routers[i];
            let regex = new RegExp(pathToRegexp(route.path));
            if (regex.test(path)) {
                let keys = [];
                let regexp = pathToRegexp(route.path, keys, {sensitive: true, strict: true});
                let pathParams: any = {};
                if (keys.length > 0) {
                    let result = regexp.exec(path);
                    for (let j = 0; j < keys.length; j++) {
                        pathParams[keys[j].name] = result[j + 1];
                    }
                }
                return {
                    route: route,
                    pathParams
                };
            }
        }
        return null;
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