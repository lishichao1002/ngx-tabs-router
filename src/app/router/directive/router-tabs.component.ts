import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '../router';
import {TabsEvent} from '../events';
import {RouterTab} from '../router_tab';
import {RouterTabComponent} from './router-tab.component';
import 'rxjs/add/operator/filter';
import {isParamsEquals, isUrlStateEquals, isUrlStateLike, UrlState} from '../pojo/url_state';

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
                public tabsEvent: TabsEvent,
                public resolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.tabsEvent.addTabSubject.filter(val => val != null)
            .subscribe((routerTab: RouterTab) => {
                const factory: ComponentFactory<RouterTabComponent> = this.resolver.resolveComponentFactory(RouterTabComponent);
                let componentRef: ComponentRef<RouterTabComponent> = this._container.createComponent(factory);

                let component: RouterTabComponent = componentRef.instance;
                component.routerTab = routerTab;
                component.hidden = !routerTab.selected;

                this._tabs.set(routerTab.tabId, componentRef);
            });

        this.tabsEvent.removeTabSubject.filter(val => val != null)
            .subscribe((tabId: number) => {
                let componentRef: ComponentRef<RouterTabComponent> = this._tabs.get(tabId);
                componentRef.destroy();
                this._tabs.delete(tabId);
            });

        this.tabsEvent.switchTabSubject.filter(val => val != null)
            .subscribe((tabId: number) => {
                this._tabs.forEach((value: ComponentRef<RouterTabComponent>, key: number) => {
                    let component: RouterTabComponent = value.instance;
                    if (tabId == key) {
                        component.routerTab.selected = true;
                        component.hidden = false;
                    } else {
                        component.routerTab.selected = false;
                        component.hidden = true;
                    }
                });
            });

        this.tabsEvent.navigateSubject.filter(val => val != null)
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
                componentRef.instance.initComponent();
                this._publishEvents(pre, next, 'pushState');
            });

        this.tabsEvent.goBackSubject.filter(val => val != null)
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
                componentRef.instance.initComponent();
                this._publishEvents(pre, next, 'replaceState');
            });
    }

    private _publishEvents(pre: UrlState, next: UrlState, mode: 'replaceState' | 'pushState') {
        let params_changed: boolean = false;
        if (!isParamsEquals(pre.pathParams, next.pathParams)) {
            params_changed = true;
            this.tabsEvent.pathParams.next(next.pathParams);
        }

        if (!isParamsEquals(pre.queryParams, next.queryParams)) {
            params_changed = true;
            this.tabsEvent.pathParams.next(next.queryParams);
        }

        if (params_changed) {
            this.tabsEvent.pathParams.next({...next.queryParams, ...next.pathParams});
        }

        if (pre.fragment != next.fragment) {
            this.tabsEvent.fragment.next(next.fragment);
        }

        switch (mode) {
            case 'replaceState':
                window.history.replaceState(null, null, next.href);
                break;
            case 'pushState':
                window.history.pushState(null, null, next.href);
                break;
        }
    }

}
