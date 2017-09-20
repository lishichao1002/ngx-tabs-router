import {Directive, HostBinding, HostListener, Input} from '@angular/core';
import {Router} from './router';

@Directive({
    selector: '[routerLink]'
})
export class RouterLinkDirective {

    @HostBinding() href: string;

    constructor(private router: Router) {
    }

    private _routerLink: string;
    @Input() set routerLink(routerLink: string) {
        this._routerLink = routerLink;
        this.href = routerLink;
    }

    get routerLink() {
        return this._routerLink;
    }

    @HostListener('click')
    onclick() {
        this.router.addRouteAndComponent(this.routerLink);
        return false;
    }

}