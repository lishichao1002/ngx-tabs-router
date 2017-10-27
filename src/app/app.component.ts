import {Component} from '@angular/core';
import {Router} from './router/router';

@Component({
    selector: 'app-root',
    template: `
        <ul>
            <li><a routerLink="demo1">demo1</a></li>
            <li><a routerLink="demo2" [queryParams]="{a: 'a', b: 'b'}">demo2</a></li>
            <li><a [routerLink]="['demo3']" [queryParams]="{d: 'd', c: 'c'}">demo3</a></li>
        </ul>
        <div class="row" style="margin:10px 0px;">

            <button class="btn btn-primary btn-xs" (click)="addTab()">add tab</button>

            <button *ngIf="(canGo$ | async)" class="btn btn-primary btn-xs" (click)="go()">Go</button>
            <button *ngIf="!(canGo$ | async)" class="btn btn-primary btn-xs disabled">Go</button>

            <button *ngIf="(canBack$ | async)" class="btn btn-primary btn-xs" (click)="back()">Back</button>
            <button *ngIf="!(canBack$ | async)" class="btn btn-primary btn-xs disabled">Back</button>

        </div>

        <router-tabs></router-tabs>
    `
})
export class AppComponent {

    canGo$;
    canBack$;

    constructor(private router: Router) {
        this.canGo$ = this.router.canGo$;
        this.canBack$ = this.router.canBack$;
    }

    go() {
        this.router.go();
    }

    back() {
        this.router.back();
    }

    addTab() {
        this.router.addTab();
    }

}
