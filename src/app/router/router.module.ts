import {ANALYZE_FOR_ENTRY_COMPONENTS, Inject, ModuleWithProviders, NgModule, Optional} from '@angular/core';
import {APP_BASE_HREF, CommonModule, Location, LocationStrategy, PathLocationStrategy, PlatformLocation} from '@angular/common';
import {Router} from './router';
import {RouterTabsComponent} from './directive/router-tabs.component';
import {RouterTabComponent} from './directive/router-tab.component';
import {Routes, ROUTES} from './pojo/route';
import {UrlParser} from './pojo/url_state';
import {RouterLink, RouterLinkWithHref} from './directive/router-link.directive';
import {TabsManager} from './tab_manager';
import {RouterLinkActive} from './directive/router_link_active';

export function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string) {
    return new PathLocationStrategy(platformLocationStrategy, baseHref);
}

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        RouterTabsComponent,
        RouterTabComponent,
        RouterLink,
        RouterLinkWithHref,
        RouterLinkActive
    ],
    entryComponents: [
        RouterTabComponent
    ],
    exports: [
        RouterTabsComponent,
        RouterTabComponent,
        RouterLink,
        RouterLinkWithHref,
        RouterLinkActive
    ],
    providers: [
        Router,
        TabsManager
    ]
})
export class RouterModule {

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: RouterModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},
                {provide: ROUTES, useValue: routes},
                Router,
                UrlParser,
                {
                    provide: LocationStrategy,
                    useFactory: provideLocationStrategy,
                    deps: [PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()]]
                },
                Location
            ]
        };
    }
}
