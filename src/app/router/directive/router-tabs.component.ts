import {
    ChangeDetectorRef,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    OnInit,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {Router} from "../router";
import {TabsManager} from "../tab_manager";
import {RouterTab} from "../router_tab";
import {RouterTabComponent} from "./router-tab.component";
import {isParamsEquals, isUrlStateEquals, isUrlStateLike, UrlParser, UrlState} from "../pojo/url_state";
import "rxjs/add/operator/filter";
import {Snapshot} from "../pojo/snapshot";
import {AddTabEvent, NavigateEvent, RemoveTabEvent, SwitchTabEvent} from "../pojo/events";

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
                public changeDetectorRef: ChangeDetectorRef,
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

                let {queryParams, fragment} = this.urlParser.parseHref(window.location.href);
                routerTab.snapshot = new Snapshot(queryParams, {}, queryParams, fragment);
            });

        this.tabsManager.removeTabSubject.filter(val => val != null)
            .subscribe((tabId: number) => {
                let componentRef: ComponentRef<RouterTabComponent> = this._tabs.get(tabId);
                componentRef.destroy();
                this._tabs.delete(tabId);
                this.tabsManager.eventsSubject.next(new RemoveTabEvent());
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
                this.changeDetectorRef.detectChanges();
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
                this.changeDetectorRef.detectChanges();
            });
    }

    private _publishEvents(pre: UrlState, next: UrlState, mode: 'replaceState' | 'pushState') {
        let params_changed: boolean = false;

        let params = {...next.queryParams, ...next.pathParams};
        this.tabsManager.current.snapshot = new Snapshot(params, next.pathParams, next.queryParams, next.fragment);

        switch (mode) {
            case 'replaceState':
                window.history.replaceState(null, null, next.href);
                this.tabsManager.eventsSubject.next(new NavigateEvent('replaceState', next.href));
                break;
            case 'pushState':
                window.history.pushState(null, null, next.href);
                this.tabsManager.eventsSubject.next(new NavigateEvent('pushState', next.href));
                break;
        }

        if (!isParamsEquals(pre.pathParams, next.pathParams)) {
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
    }

    private _addTabCounts: number = 0;

    private _updateAddTabHref() {
        let {queryParams, fragment} = this.urlParser.parseHref(window.location.href);
        let href = this.urlParser.emptyRouteUrl('/', queryParams, fragment);
        window.history.replaceState(null, null, href);
        if (++this._addTabCounts > 1) { //如果tab的个数大于1才触发该事件，tab=1这里认为是默认的一个tab页，不触发该事件
            this.tabsManager.eventsSubject.next(new AddTabEvent(href));
        }
    }

    private _switchTabCounts: number = 0;

    private _updateSwitchTabHref(tab: RouterTab) {
        if (tab.current) {
            window.history.replaceState(null, null, tab.current.href);
            if (++this._switchTabCounts > 1) { //同上,如果时地址则认为是默认的一个tab页，不触发该事件
                this.tabsManager.eventsSubject.next(new SwitchTabEvent(tab.current.href));
            }
        } else {
            this._updateAddTabHref();
        }
    }
}
