import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, ROUTES} from './types';
import {CommonModule} from '@angular/common';
import {RouterLinkDirective} from './router-link.directive';
import {Router} from './router';
import {RouterTabComponent, RouterTabsComponent} from './router-tabs.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        RouterTabsComponent,
        RouterTabComponent,
        RouterLinkDirective
    ],
    exports: [
        RouterTabsComponent,
        RouterTabComponent,
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
