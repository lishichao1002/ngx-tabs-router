import {InjectionToken, Type} from '@angular/core';

export interface Route {
    default?: boolean;
    title: string;
    path: string;
    component: Type<any>;
    redirectTo?: string;
}

export interface RouteX extends Route {
    href: string;
}

export type Params = {
    [key: string]: any
};

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');

export type QueryParamsHandling = 'merge';

export interface NavigationExtras {

    queryParams?: Params | null;

    queryParamsHandling?: QueryParamsHandling;
}

export interface RelativePathAndRoute {
    route: Route;
    relativePath: string;
}

export interface FullPathAndRoute {
    route?: Route;
    fullPath: string;
}