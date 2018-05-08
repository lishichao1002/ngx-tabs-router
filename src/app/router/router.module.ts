import {
    ANALYZE_FOR_ENTRY_COMPONENTS,
    ModuleWithProviders,
    NgModule,
    NgModuleFactoryLoader,
    SystemJsNgModuleLoader,
    Type
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ROUTES} from '@angular/router';

export interface Route {
    path: string;
    component?: Type<any>;
    loadChildren?: string;
}

export declare type Routes = Route[];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    entryComponents: [],
    exports: [],
    providers: []
})
export class RouterModule {

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: RouterModule,
            providers: [
                {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},
                {provide: ROUTES, useValue: routes, multi: true},
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return {
            ngModule: RouterModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},
                {provide: ROUTES, multi: true, useValue: routes}
            ]
        };
    }
}