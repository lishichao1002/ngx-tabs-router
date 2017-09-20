import {ModuleWithProviders, NgModule} from '@angular/core';
import {TabsRouterComponent} from './tabs-router.component';
import {Routes, ROUTES} from './types';
import {CommonModule} from '@angular/common';
import {RouterLinkDirective} from './router-link.directive';
import {Router} from './router';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TabsRouterComponent,
        RouterLinkDirective
    ],
    exports: [
        TabsRouterComponent,
        RouterLinkDirective
    ],
    providers: [
        Router
    ]
})
export class RouterModule {

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: RouterModule,
            providers: [{
                provide: ROUTES,
                useValue: routes
            }]
        };
    }
}
