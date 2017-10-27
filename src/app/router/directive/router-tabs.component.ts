import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '../router';
import {RouterTab} from '../router_tab';
import {RouterTabComponent} from './router-tab.component';

@Component({
    selector: 'router-tabs',
    template: `
        <!--<ng-container *ngFor="let tab of (tabs$ | async)">-->
        <!--<router-tab [routerTab]="tab" [class.hidden]="!tab.selected" #routetab></router-tab>-->
        <!--</ng-container>-->
        <ng-container #container></ng-container>
    `
})
export class RouterTabsComponent {

    // tabs$: Observable<RouterTab[]>;

    private tabs: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab }[] = [];

    @ViewChild('container', {read: ViewContainerRef})
    private _container: ViewContainerRef;

    constructor(private router: Router,
                private resolver: ComponentFactoryResolver) {
        // this.tabs$ = this.router.tabs;
    }

    private _current_tab: { componentRef: ComponentRef<RouterTabComponent>, routerTab: RouterTab };

    addTab(routerTab: RouterTab) {
        const factory: ComponentFactory<RouterTabComponent> = this.resolver.resolveComponentFactory(RouterTabComponent);
        let componentRef: ComponentRef<RouterTabComponent> = this._container.createComponent(factory);

        let component: RouterTabComponent = componentRef.instance;
        component.routerTab = routerTab;
        component.hidden = !routerTab.selected;
        routerTab.outlet = component;

        this.tabs.push({
            componentRef: componentRef,
            routerTab: routerTab
        });
    }

    selectTab(tabId: number) {
        for (let i = 0; i < this.tabs.length; i++) {
            let {componentRef, routerTab} = this.tabs[i];
            let component: RouterTabComponent = componentRef.instance;
            if (routerTab.tabId == tabId) {
                component.hidden = false;
                this._current_tab = this.tabs[i];
            } else {
                component.hidden = true;
            }
        }
    }

    removeTab(tabId: number) {
        for (let i = 0; i < this.tabs.length; i++) {
            let {componentRef, routerTab} = this.tabs[i];
            if (routerTab.tabId == tabId) {
                componentRef.destroy();
                this.tabs.splice(i);

                if (this._current_tab == this.tabs[i]) {
                    this._current_tab = null;
                    //TODO 选中上一个
                }

                return;
            }
        }
    }


}
