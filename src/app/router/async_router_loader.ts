import {Compiler, Injector, NgModuleFactory, NgModuleFactoryLoader} from '@angular/core';
import {LoadChildren, LoadedRouterConfig, Route, ROUTES} from './pojo/route';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

export class RouterConfigLoader {
    constructor(private loader: NgModuleFactoryLoader,
                private compiler: Compiler) {
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
            // loadChildren()
            //     .then((module: any) => {
            //         return this.compiler.compileModuleAndAllComponentsAsync(module);
            //     })
            //     .then((module) => {
            //         observer.next(module.ngModuleFactory);
            //         observer.complete();
            //     });
            this.loader.load(loadChildren).then((factory) => {
                observer.next(factory);
                observer.complete();
            });
        });
    }
}