import {Route, ROUTES} from './route';
import * as URI from 'urijs';
import * as pathToRegexp from 'path-to-regexp';
import {NavigationExtras, PathParams, QueryParams} from './params';
import {forwardRef, Inject, Injectable} from '@angular/core';
import {LocationStrategy} from '@angular/common';

export type UrlSegment = string;

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
                public fragment: string,
                public href: string) {
    }

    toString() {
        return this.href;
    }
}

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
        const segments: UrlSegment[] = uri.segment();
        const queryParams: QueryParams = uri.query(true);
        const fragment: string = uri.fragment();
        const {route, pathParams} = this.parseRoute(segments) || {route: null, pathParams: null};
        return route ? new UrlState(this._base_url, route, segments, pathParams, queryParams, fragment, href) : null;
    }

    createUrlState(segments: any[] | string, extras?: NavigationExtras): UrlState {
        segments = Array.isArray(segments) ? segments : [segments];
        const parse_result = this.parseRoute(segments);
        if (!parse_result) throw Error(`路由不存在, ${segments.join('/')}`);

        const {queryParams: curr_queryParams, fragment: curr_fragment} = this.parseHref(window.location.href);

        const {route: dist_route, pathParams: dist_pathParams} = parse_result;

        let dist_param: QueryParams, dist_fragment;

        if (extras && !extras.queryParamsHandling) {
            dist_param = {};
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
        let uri = new URI(segments.join('/')).absoluteTo(this._base_url).query(queryParams).fragment(fragment);
        return new UrlState(this._base_url, route, segments, pathParams, queryParams, fragment, uri.toString());
    }

    createEmptyUrlState(queryParams: QueryParams = {}, fragment: string = ''): UrlState {
        let uri = new URI(this._base_url).query(queryParams).fragment(fragment);
        return new UrlState(this._base_url, null, null, null, queryParams, fragment, uri.toString());
    }

    /**
     * 解析绝对路径 href
     */
    parseHref(href: string): { segments: UrlSegment[], queryParams: QueryParams, fragment: string } {
        let uri = new URI(href).relativeTo(this._base_url);
        const segments: UrlSegment[] = uri.segment();
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
        for (let i = 0; i < this.routers.length; i++) {
            let route: Route = this.routers[i];
            let regex = new RegExp(pathToRegexp(route.path));
            if (regex.test(path)) {
                let keys = [];
                let regexp = pathToRegexp(route.path, keys);
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
}