import {
    ChangeDetectionStrategy,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Route} from '../pojo/route';

@Component({
    selector: 'router-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!--<ng-container *ngComponentOutlet="route?.component"></ng-container>-->
        <ng-container #container></ng-container>
    `
})
export class RouterTabComponent {

    @Input() route: Route;

    constructor(private titleService: Title,
                private resolver: ComponentFactoryResolver) {
    }

    @ViewChild('container', {read: ViewContainerRef})
    private _container: ViewContainerRef;
    private _componentRef: ComponentRef<any>;

    initComponent() {
        if (this.route.component) {
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.route.component);
            this._componentRef = this._container.createComponent(factory);
        }
    }

    destoryComponent() {
        if (this._componentRef) {
            this._componentRef.destroy();
            this._componentRef = null;
        }
        this._container.clear();
    }
}