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
    private tabs_sub: Subject<{ componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab }[]>;

    currentTab: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab };

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    constructor(private router: Router,
                private resolver: ComponentFactoryResolver) {
        this.tabs = [];
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

        this.tabs.push({
            componentRef: componentRef,
            routerTab: routerTab
        });

        this.tabs_sub.next(this.tabs);
    }

    selectTab(tabId: number) {
        for (let i = 0; i < this.tabs.length; i++) {
            let {componentRef, routerTab} = this.tabs[i];
            let component: RouterTabComponent = componentRef.instance;
            if (routerTab.tabId == tabId) {
                component.hidden = false;
                this.currentTab = this.tabs[i];
            } else {
                component.hidden = true;
            }
        }

        this.tabs_sub.next(this.tabs);
    }

    removeTab(tabId: number) {
        for (let i = 0; i < this.tabs.length; i++) {
            let {componentRef, routerTab} = this.tabs[i];
            if (routerTab.tabId == tabId) {
                componentRef.destroy();
                this.tabs.splice(i);

                if (this.currentTab == this.tabs[i]) {
                    this.currentTab = null;
                    //TODO 选中上一个
                }

                this.tabs_sub.next(this.tabs);
                return;
            }
        }
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
