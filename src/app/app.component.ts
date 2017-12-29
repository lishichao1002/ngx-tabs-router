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
                <button routerLink="demo1" [queryParamsHandling]="''">demo1?</button>
                <button routerLink="demo1" [queryParamsHandling]="''" [queryParams]="{a: '1'}">demo1?a</button>
                <button routerLink="demo1" [queryParamsHandling]="'merge'">demo1??</button>
            </li>
            <li>
                <button routerLink="demo2" [queryParamsHandling]="''">demo2?</button>
                <button routerLink="demo2" [queryParamsHandling]="''" [queryParams]="{b: '1'}">demo2?b</button>
                <button routerLink="demo2" [queryParamsHandling]="'merge'">demo2??</button>
            <li>
                <button routerLink="demo3/A" [queryParamsHandling]="''">demo3A?</button>
                <button routerLink="demo3/A" [queryParamsHandling]="''" [queryParams]="{c: '1'}">demo3A?c</button>
                <button routerLink="demo3/A" [queryParamsHandling]="'merge'">demo3A??</button>
            </li>
            <li>
                <button routerLink="demo3/B" [queryParamsHandling]="''">demo3B?</button>
                <button routerLink="demo3/B" [queryParamsHandling]="''" [queryParams]="{d: '1'}">demo3B?d</button>
                <button routerLink="demo3/B" [queryParamsHandling]="'merge'">demo3B??</button>
            </li>
            <li>
                <a [routerLink]="['demo3/C']" queryParamsHandling="merge">demo3-C</a>
            </li>
            <li>
                <a [routerLink]="['otherwise']" [queryParams]="{d: 'd2', f: 'f'}" queryParamsHandling="merge">otherwise</a>
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
        // this.router.events.subscribe((event) => {
        //     console.log('app events', event);
        // });
        //
        // this.router.params.subscribe((params) => {
        //     console.log('app params ', params, this.router.tab.tabId);
        // });
        //
        // this.router.queryParams.subscribe((queryParams) => {
        //     console.log('app queryParams ', queryParams, this.router.tab.tabId);
        // });
        //
        // this.router.pathParams.subscribe((pathParams) => {
        //     console.log('app pathParams ', pathParams, this.router.tab.tabId);
        // });
        //
        // this.router.fragment.subscribe((fragment) => {
        //     console.log('app fragment ', fragment, this.router.tab.tabId);
        // });
    }

    ngOnDestroy() {

    }

}
