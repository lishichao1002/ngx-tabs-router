import {Component} from '@angular/core';
import {Router} from './router/router';

@Component({
    selector: 'app-root',
    styles: [`
        .selected, .selected a {
            color: red;
            border: 1px solid red;
        }
    `],
    template: `
        <ul>
            <li>
                <button routerLinkActive="selected">
                    <a routerLink="demo1">demo1</a>
                </button>
            </li>
            <li><a routerLink="demo2" [queryParams]="{a: 'a', b: 'b'}" routerLinkActive="selected">demo2</a></li>
            <li><a [routerLink]="['demo3/A']" [queryParams]="{d: 'A', c: 'c'}" queryParamsHandling="merge" routerLinkActive="selected">demo3-A</a>
            </li>
            <li><a [routerLink]="['demo3/B']" [queryParams]="{d: 'B', c: 'c'}" queryParamsHandling="merge" routerLinkActive="selected">demo3-B</a>
            </li>
            <li>
                <a [routerLink]="['demo3/C']" queryParamsHandling="merge" routerLinkActive="selected"
                   routerLinkActive="selected">demo3-C</a>
            </li>
            <li>
                <a [routerLink]="['otherwise']" [queryParams]="{d: 'd2', f: 'f'}" queryParamsHandling="merge" routerLinkActive="selected">otherwise</a>
            </li>
        </ul>

        <router-nav></router-nav>
        <div class="row" style="margin:20px;">
            <router-tabs></router-tabs>
        </div>
    `
})
export class AppComponent {

    constructor(private router: Router) {

    }

    ngOnInit() {
        console.warn('-------------------------------------------------');
        this.router.events.subscribe((event) => {
            console.log('app events', event);
        });

        this.router.params.subscribe((params) => {
            console.log('app params ', params, this.router.tab.tabId);
        });

        this.router.queryParams.subscribe((queryParams) => {
            console.log('app queryParams ', queryParams, this.router.tab.tabId);
        });

        this.router.pathParams.subscribe((pathParams) => {
            console.log('app pathParams ', pathParams, this.router.tab.tabId);
        });

        this.router.fragment.subscribe((fragment) => {
            console.log('app fragment ', fragment, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {

    }

}
