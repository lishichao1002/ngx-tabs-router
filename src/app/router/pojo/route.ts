import {InjectionToken, NgModuleRef, Type} from '@angular/core';
import {RouterTab} from '../router_tab';
import {Snapshot} from './snapshot';

export type String = string;
export type StringLike = () => string;
export type StringOrStringLike = StringLike | String;

export declare type LoadChildren = any;

export interface ITitle {
    getTitle(route: Route, tab: RouterTab): string;
}

export type Title = ITitle | StringOrStringLike;

export interface IRouteKey {
    getUniqueKey(route: Route, snapshot: Snapshot): string;
}

export interface Route {
    path: string;
    title?: any; //Title
    component?: Type<any>;
    redirectTo?: string;
    uniqueKey?: any;
    loadChildren?: LoadChildren;
    _config?: LoadedRouterConfig;
}

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');

export class LoadedRouterConfig {
    constructor(public routes: Route[], public module: NgModuleRef<any>) {
    }
}