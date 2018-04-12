import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {Router} from '../router';
import {UrlParser} from '../pojo/url_state';
import 'rxjs/add/operator/filter';
import {RouterState} from '../tabs_state';

@Component({
    selector: 'router-tabs',
    template: `
        <ng-container #container></ng-container>

        <router-tab *ngFor="let tab of states.tabs" [tab]="tab"></router-tab>
    `
})
export class RouterTabsComponent implements OnInit {

    constructor(public router: Router,
                public states: RouterState,
                public urlParser: UrlParser,
                public changeDetectorRef: ChangeDetectorRef,
                public resolver: ComponentFactoryResolver) {
    }

    ngOnInit() {

    }
}
