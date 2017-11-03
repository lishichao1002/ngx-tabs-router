import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '../router';
import {TabsManager} from '../tab_manager';
import {RouterTab} from '../router_tab';
import {RouterTabComponent} from './router-tab.component';
import {isParamsEquals, isUrlStateEquals, isUrlStateLike, UrlParser, UrlState} from '../pojo/url_state';
import 'rxjs/add/operator/filter';
import {Snapshot} from '../pojo/snapshot';

@Component({
    selector: 'router-tabs',
    template: `
        <ng-container #container></ng-container>
    `
})
export class RouterTabsComponent implements OnInit {

    @ViewChild('container', {read: ViewContainerRef})
    private _container: ViewContainerRef;
    private _tabs: Map<number, ComponentRef<RouterTabComponent>> = new Map();

    constructor(public router: Router,
                public tabsManager: TabsManager,
                public urlParser: UrlParser,
                public resolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.tabsManager.addTabSubject.filter(val => val != null)
            .subscribe((routerTab: RouterTab) => {
                const factory: ComponentFactory<RouterTabComponent> = this.resolver.resolveComponentFactory(RouterTabComponent);
                let componentRef: ComponentRef<RouterTabComponent> = this._container.createComponent(factory);

                let component: RouterTabComponent = componentRef.instance;
                component.routerTab = routerTab;
                component.hidden = !routerTab.selected;

                this._tabs.set(routerTab.tabId, componentRef);
                this._updateAddTabHref();
            });

        this.tabsManager.removeTabSubject.filter(val => val != null)
            .subscribe((tabId: number) => {
                let componentRef: ComponentRef<RouterTabComponent> = this._tabs.get(tabId);
                componentRef.destroy();
                this._tabs.delete(tabId);
            });

        this.tabsManager.switchTabSubject.filter(val => val != null)
            .subscribe((tabId: number) => {
                this._tabs.forEach((value: ComponentRef<RouterTabComponent>, key: number) => {
                    let component: RouterTabComponent = value.instance;
                    if (tabId == key) {
                        component.routerTab.selected = true;
                        component.hidden = false;
                        this._updateSwitchTabHref(component.routerTab);
                    } else {
                        component.routerTab.selected = false;
                        component.hidden = true;
                    }
                });
            });

        this.tabsManager.navigateSubject.filter(val => val != null)
            .subscribe(({pre, next}) => {
                if (isUrlStateEquals(pre, next)) {
                    return;
                }

                if (isUrlStateLike(pre, next)) {
                    this._publishEvents(pre, next, 'pushState');
                    console.log('路由相同，只更新路由地址参数，不重新创建路由组件');
                    return;
                }

                let componentRef: ComponentRef<RouterTabComponent> = this._tabs.get(this.router.tab.tabId);
                componentRef.instance.destroyComponent();
                this._publishEvents(pre, next, 'pushState');
                componentRef.instance.initComponent();
            });

        this.tabsManager.goBackSubject.filter(val => val != null)
            .subscribe(({pre, next}) => {
                if (isUrlStateEquals(pre, next)) {
                    return;
                }

                if (isUrlStateLike(pre, next)) {
                    this._publishEvents(pre, next, 'replaceState');
                    console.log('路由相同，只更新路由地址参数，不重新创建路由组件');
                    return;
                }

                let componentRef: ComponentRef<RouterTabComponent> = this._tabs.get(this.router.tab.tabId);
                componentRef.instance.destroyComponent();
                this._publishEvents(pre, next, 'replaceState');
                componentRef.instance.initComponent();
            });
    }

    private _publishEvents(pre: UrlState, next: UrlState, mode: 'replaceState' | 'pushState') {
        let params_changed: boolean = false;
        if (isUrlStateLike(pre, next) && !isParamsEquals(pre.pathParams, next.pathParams)) {
            params_changed = true;
            this.tabsManager.pathParams.next(next.pathParams);
            this.tabsManager.current._pathParamsSubject.next(next.pathParams);
        }

        if (!isParamsEquals(pre.queryParams, next.queryParams)) {
            params_changed = true;
            this.tabsManager.queryParams.next(next.queryParams);
            this.tabsManager.current._queryParamsSubject.next(next.queryParams);
        }

        if (params_changed) {
            this.tabsManager.params.next({...next.queryParams, ...next.pathParams});
            this.tabsManager.current._paramsSubject.next({...next.queryParams, ...next.pathParams});
        }

        if (pre.fragment != next.fragment) {
            this.tabsManager.fragment.next(next.fragment);
            this.tabsManager.current._fragmentSubject.next(next.fragment);
        }

        let params = {...next.queryParams, ...next.pathParams};
        this.tabsManager.current.snapshot = new Snapshot(params, next.pathParams, next.queryParams, next.fragment);

        switch (mode) {
            case 'replaceState':
                window.history.replaceState(null, null, next.href);
                break;
            case 'pushState':
                window.history.pushState(null, null, next.href);
                break;
        }
    }

    private _updateAddTabHref() {
        let {queryParams, fragment} = this.urlParser.parseHref(window.location.href);
        let href = this.urlParser.emptyRouteUrl('/', queryParams, fragment);
        window.history.replaceState(null, null, href);
    }

    private _updateSwitchTabHref(tab: RouterTab) {
        if (tab.current) {
            window.history.replaceState(null, null, tab.current.href);
        } else {
            this._updateAddTabHref();
        }
    }
}
