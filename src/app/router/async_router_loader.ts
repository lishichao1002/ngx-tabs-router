import {Injector, NgModuleFactory, NgModuleFactoryLoader} from '@angular/core';
import {LoadChildren, LoadedRouterConfig, Route} from './pojo/route';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {ROUTES} from '@angular/router';

export class RouterConfigLoader {

    constructor(private loader: NgModuleFactoryLoader) {
    }

    load(parentInjector: Injector, route: Route): Observable<LoadedRouterConfig> {
        return this
            .loadModuleFactory(route.loadChildren)
            .pipe(
                map((factory: NgModuleFactory<any>) => {
                    const module = factory.create(parentInjector);
                    console.log(module.injector.get(ROUTES));
                    return new LoadedRouterConfig((module.injector.get(ROUTES) as any[])[0], module);
                })
            );
    }

    private loadModuleFactory(loadChildren: LoadChildren): Observable<NgModuleFactory<any>> {
        return Observable.create((observer) => {
            this.loader.load(loadChildren).then((factory) => {
                observer.next(factory);
                observer.complete();
            });
        });
    }
}