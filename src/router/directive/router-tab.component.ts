import {
    ChangeDetectionStrategy,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    HostBinding,
    Input,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterTab} from '../router_tab';
import {Router} from '../router';

@Component({
    selector: 'router-tab',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <ng-container #container></ng-container>
    `
})
export class RouterTabComponent {

    constructor(private titleService: Title,
                private router: Router,
                private resolver: ComponentFactoryResolver) {
    }

    @HostBinding('class.hidden')
    @Input() hidden: boolean;
    @Input() routerTab: RouterTab;

    @ViewChild('container', {read: ViewContainerRef})
    private _container: ViewContainerRef;
    private _componentRef: ComponentRef<any>;

    initComponent() {
        let route = this.routerTab.current.route;
        if (route) {
            let resolver = this.resolver;
            if (route._config) {
                resolver = route._config.module.componentFactoryResolver;
            }
            let factory: ComponentFactory<any> = resolver.resolveComponentFactory(route.component);
            this._componentRef = this._container.createComponent(factory);
            this.titleService.setTitle(this.router.getTitle(route, this.routerTab));
        }
    }

    destroyComponent() {
        if (this._componentRef) {
            this._componentRef.destroy();
            this._componentRef = null;
        }
        this._container.clear();
    }
}