import {Directive, HostBinding, HostListener, Input, OnChanges} from '@angular/core';
import {Router} from './router';
import {QueryParamsHandling} from './types';

export type String = string;
export type StringResolver = () => string;
export type StringOrResolver = () => string;


/**
 * <a routerLink="/bbs" queryParamsHandling="merge"></a>
 * <a [routerLink]="['/bbs/topic', '1', '2', '1', '3']"></a>
 * <a [routerLink]="currentHash()" [queryParams]="{product: productId, product.localeId}" queryParamsHandling="merge"></a>
 */
@Directive({
    selector: '[routerLink]'
})
export class RouterLinkDirective implements OnChanges {

    @Input() queryParams: { [k: string]: any };
    @Input() queryParamsHandling: QueryParamsHandling;
    @HostBinding() href: string;

    constructor(private router: Router) {
    }

    private _commands: any[];

    @Input() set routerLink(commands: any[] | StringOrResolver) {
        if (commands != null) {
            if (Array.isArray(commands)) {
                this._commands = commands;
            } else if (typeof commands === 'string') {
                this._commands = [commands];
            } else if (typeof commands === 'function') {
                this._commands = [commands()];
            } else {
                this._commands = [];
            }
        } else {
            this._commands = [];
        }
    }

    @HostListener('click')
    onclick() {
        this.router.navigateByUrl(this._commands, {
            queryParams: this.queryParams,
            queryParamsHandling: this.queryParamsHandling
        });
        return false;
    }

    ngOnChanges(changes: {}): any {
        this.href = this.router.getFullPathAndRoute(this._commands, {
            queryParams: this.queryParams,
            queryParamsHandling: this.queryParamsHandling
        }).fullPath;
    }


}