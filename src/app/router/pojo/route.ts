import {InjectionToken, Type} from "@angular/core";
import {RouterTab} from "../router_tab";

export type String = string;
export type StringLike = () => string;
export type StringOrStringLike = StringLike | String;

export interface ITitle {
    getTitle(route: Route, tab: RouterTab): string;
}

export type Title = ITitle | StringOrStringLike;

export interface Route {
    title?: any; //Title
    path: string;
    component?: Type<any>;
    redirectTo?: string;
}

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');
