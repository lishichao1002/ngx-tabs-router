import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '../router';
import {RouterTab} from '../router_tab';
import {RouterTabComponent} from './router-tab.component';
import {UrlState} from '../pojo/url_state';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Component({
    selector: 'router-tabs',
    template: `
        <ng-container #container></ng-container>
    `
})
export class RouterTabsComponent implements OnInit {

    private tabs: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab }[];
    private tabs_order: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab }[];
    private tabs_sub: Subject<{ componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab }[]>;

    currentTab: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab };

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    constructor(private router: Router,
                private resolver: ComponentFactoryResolver) {
        this.tabs = [];
        this.tabs_order = [];
        this.tabs_sub = new BehaviorSubject(this.tabs);
    }

    ngOnInit() {
        this.router.outlets = this;
        this.router._init();
    }

    get routerTabs(): Observable<RouterTab[]> {
        return this.tabs_sub.asObservable().map((items) => items.map(item => item.routerTab));
    }

    addTab(routerTab: RouterTab) {
        const factory: ComponentFactory<RouterTabComponent> = this.resolver.resolveComponentFactory(RouterTabComponent);
        let componentRef: ComponentRef<RouterTabComponent> = this.container.createComponent(factory);

        let component: RouterTabComponent = componentRef.instance;
        component.routerTab = routerTab;
        component.hidden = !routerTab.selected;
        routerTab.outlet = component;

        let tab = {
            componentRef: componentRef,
            routerTab: routerTab
        };
        this.tabs.push(tab);
        this.tabs_order.push(tab);

        this.tabs_sub.next(this.tabs);
    }

    selectTab(tabId: number) {
        for (let i = 0; i < this.tabs.length; i++) {
            let {componentRef, routerTab} = this.tabs[i];
            let component: RouterTabComponent = componentRef.instance;
            if (routerTab.tabId == tabId) {
                routerTab.selected = true;
                component.hidden = false;
                this.currentTab = this.tabs[i];
            } else {
                routerTab.selected = false;
                component.hidden = true;
            }
        }

        //排序
        for (let i = 0; i < this.tabs_order.length; i++) {
            let tab = this.tabs_order[i];
            let {routerTab} = tab;
            if (routerTab.tabId == tabId) {
                this.tabs_order.splice(i, 1).push(tab);
                break;
            }
        }

        this.tabs_sub.next(this.tabs);
    }

    removeTab(tabId: number) {
        if (this.tabs.length == 1) throw Error(`当前只有一个tab页,不能被删除`);

        let tabs = this.tabs.filter((tab) => tab.routerTab.tabId == tabId);
        if (tabs.length === 0) throw Error(`tabId(${tabId})非法`);

        let will_deleted = tabs[0];
        let index = this.tabs.indexOf(will_deleted);
        this.tabs.splice(index, 1);

        tabs = this.tabs_order.filter((tab) => tab.routerTab.tabId == tabId);
        will_deleted = tabs[0];
        index = this.tabs_order.indexOf(will_deleted);
        this.tabs_order.splice(index, 1);

        will_deleted.componentRef.destroy();

        if (will_deleted.routerTab.selected) {
            this.selectTab(this.tabs_order[this.tabs_order.length - 1].routerTab.tabId);
        }

        this.tabs_sub.next(this.tabs);
    }

    navigate(urlState: UrlState) {
        this.currentTab.routerTab.addRoute(urlState);
        this.currentTab.componentRef.instance.destroyComponent();
        this.currentTab.componentRef.instance.initComponent();
    }

    go() {
        this.currentTab.routerTab.go();
        this.currentTab.componentRef.instance.destroyComponent();
        this.currentTab.componentRef.instance.initComponent();
    }

    back() {
        this.currentTab.routerTab.back();
        this.currentTab.componentRef.instance.destroyComponent();
        this.currentTab.componentRef.instance.initComponent();
    }

}
