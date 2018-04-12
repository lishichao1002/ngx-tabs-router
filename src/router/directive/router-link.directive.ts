import {Directive, HostBinding, HostListener, Input} from '@angular/core';
import {QueryParamsHandling} from '../pojo/params';
import {Router} from '../router';
import {UrlParser} from '../pojo/url_state';

@Directive({selector: ':not(a)[routerLink]'})
export class RouterLink {

    @Input() queryParams: { [k: string]: any };
    @Input() queryParamsHandling: QueryParamsHandling = 'merge';
    @Input() fragment: string;
    @Input() preserveFragment: boolean;

    segments: any[];

    constructor(private router: Router) {
    }

    @Input()
    set routerLink(segments: any[] | string) {
        if (segments) {
            if (Array.isArray(segments)) {
                this.segments = segments;
            } else if (typeof segments === 'string') {
                this.segments = [segments];
            } else {
                this.segments = [];
            }
        } else {
            this.segments = [];
        }
    }

    @HostListener('click')
    onClick(): boolean {
        if (this.segments) {
            this.router.navigateByUrl(this.segments, {
                queryParams: this.queryParams,
                queryParamsHandling: this.queryParamsHandling,
                fragment: this.fragment,
                preserveFragment: this.preserveFragment
            });
        }
        return true;
    }

}

/**
 * <a routerLink="/bbs" queryParamsHandling="merge"></a>
 * <a [routerLink]="['/bbs/topic', '1', '2', '1', '3']"></a>
 * <a [routerLink]="currentHash()" [queryParams]="{product: productId, product.localeId}" queryParamsHandling="merge"></a>
 */
@Directive({
    selector: 'a[routerLink]'
})
export class RouterLinkWithHref {

    @HostBinding('attr.target') @Input() target: string;
    @Input() queryParams: { [k: string]: any };
    @Input() queryParamsHandling: QueryParamsHandling = 'merge';
    @Input() disabled: boolean;
    @Input() fragment: string;
    @Input() preserveFragment: boolean;
    @HostBinding() href: string;

    constructor(private router: Router,
                private urlParser: UrlParser) {
    }

    segments: any[];

    @Input()
    set routerLink(segments: any[] | string) {
        if (segments) {
            if (Array.isArray(segments)) {
                this.segments = segments;
            } else if (typeof segments === 'string') {
                this.segments = [segments];
            } else {
                this.segments = [];
            }
        } else {
            this.segments = [];
        }
    }

    @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
    onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
        if (this.disabled) {
            return false;
        }

        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }

        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }

        this.router.navigateByUrl(this.segments, {
            queryParams: this.queryParams,
            queryParamsHandling: this.queryParamsHandling,
            fragment: this.fragment,
            preserveFragment: this.preserveFragment
        });
        return false;
    }

    ngOnChanges(changes: {}): any {
        if (this.segments) {
            this.href = this.urlParser.createUrlHref(this.segments, {
                queryParams: this.queryParams,
                queryParamsHandling: this.queryParamsHandling,
                fragment: this.fragment,
                preserveFragment: this.preserveFragment
            });

            // this.urlParser.createUrlState(this.segments, {
            //     queryParams: this.queryParams,
            //     queryParamsHandling: this.queryParamsHandling,
            //     fragment: this.fragment,
            //     preserveFragment: this.preserveFragment
            // }).then((urlState) => {
            //     this.href = urlState.href;
            // });
        }
    }

}
