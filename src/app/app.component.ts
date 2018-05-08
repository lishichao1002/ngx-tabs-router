import {
    Component,
    ComponentFactory,
    ComponentRef,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    NgModuleRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ROUTES} from '@angular/router';
import {Route} from './router/router.module';

@Component({
    selector: 'app-root',
    template: `
        <h1>Router Demo</h1>

        <ng-container #container>

        </ng-container>
    `
})
export class AppComponent {

    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

    constructor(public parentInjector: Injector,
                public loader: NgModuleFactoryLoader) {

    }

    ngOnInit() {

        this.loader
            .load('app/dashboard/dashboard.module#DashboardModule')
            .then((factory: NgModuleFactory<any>) => {
                const moduleRef: NgModuleRef<any> = factory.create(this.parentInjector);
                let routers: Route[] = moduleRef.injector.get(ROUTES)[0] as any;
                let componentFactory: ComponentFactory<any> = moduleRef.componentFactoryResolver.resolveComponentFactory(routers[0].component);
                let componentRef: ComponentRef<any> = this.container.createComponent(componentFactory);

                console.log('child routers : ', routers);
            });


    }

}
