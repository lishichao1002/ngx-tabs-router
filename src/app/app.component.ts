import {Component} from '@angular/core';
import {Router} from './router/router';

@Component({
    selector: 'app-root',
    template: `
        <ul>
            <li><a routerLink="demo1">demo1</a></li>
            <li><a routerLink="demo2" [queryParams]="{a: 'a', b: 'b'}">demo2</a></li>
            <li><a [routerLink]="['demo3']" [queryParams]="{d: 'd1', c: 'c'}" queryParamsHandling="merge">demo3</a></li>
            <li><a [routerLink]="['demo3']" [queryParams]="{d: 'd2', f: 'f'}" queryParamsHandling="merge">demo3</a></li>
        </ul>

        <router-nav></router-nav>
        <div class="row" style="margin:20px;">
            <router-tabs></router-tabs>
        </div>
    `
})
export class AppComponent {

    constructor(private router: Router) {
        this.router.params.subscribe((params) => {
            console.warn('router params: ', params);
        });
    }

}
