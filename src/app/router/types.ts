import {InjectionToken, Type} from '@angular/core';

export interface Route {
    path: string;
    component: Type<any>;
    redirectTo?: string;
}

export type Params = {
    [key: string]: any
};

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');

export type QueryParamsHandling = 'merge';

export interface NavigationExtras {

    queryParams?: Params | null;

    fragment?: string;

    queryParamsHandling?: QueryParamsHandling;
}

export interface RelativePathAndRoute {
    route: Route;
    relativePath: string;
}

export interface FullPathAndRoute {
    route: Route;
    fullPath: string;
}

export interface TabRoute {
    current: boolean;
    route: Route;
    tabId: number;
}
