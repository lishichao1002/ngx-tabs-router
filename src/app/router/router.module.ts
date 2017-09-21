import {ModuleWithProviders, NgModule} from '@angular/core';
import {TabsRouterComponent} from './tabs-router.component';
import {TabRouterComponent} from './tab-router.component';
import {Routes, ROUTES} from './types';
import {CommonModule} from '@angular/common';
import {RouterLinkDirective} from './router-link.directive';
import {Router} from './router';
import {TabsStore} from './tabs';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TabsRouterComponent,
        TabRouterComponent,
        RouterLinkDirective
    ],
    exports: [
        TabRouterComponent,
        TabsRouterComponent,
        RouterLinkDirective
    ],
    providers: [
        Router,
        TabsStore
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
