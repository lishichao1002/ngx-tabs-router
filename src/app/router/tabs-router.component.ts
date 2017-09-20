import {Component, OnDestroy, OnInit, Type} from '@angular/core';
import {Router} from './router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'tabs-router',
    template: `
        <ng-container *ngComponentOutlet="component"></ng-container>
    `
})
export class TabsRouterComponent implements OnInit, OnDestroy {

    component: Type<any>;
    _routerSubscribe: Subscription;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this._routerSubscribe = this.router.onRouterChange.subscribe((component: Type<any>) => {
            this.component = component;
        });
    }

    ngOnDestroy() {
        this._routerSubscribe.unsubscribe();
    }
}