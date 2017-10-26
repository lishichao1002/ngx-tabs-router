import {InjectionToken, Type} from '@angular/core';

export interface Route {
    default?: boolean;
    title: string;
    path: string;
    component: Type<any>;
    redirectTo?: string;
}

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');