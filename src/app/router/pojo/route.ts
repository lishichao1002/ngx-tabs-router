import {InjectionToken, Type} from '@angular/core';

export interface Route {
    title: string;
    path: string;
    component: Type<any>;
}

export declare type Routes = Route[];

export const ROUTES = new InjectionToken<Routes>('ROUTES');
