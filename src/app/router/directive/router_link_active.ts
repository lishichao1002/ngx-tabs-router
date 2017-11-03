import {
    AfterContentInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '../router';
import {RouterLink, RouterLinkWithHref} from './router-link.directive';
import {NavigateEvent} from '../pojo/events';
import {UrlState} from '../pojo/url_state';

@Directive({
    selector: '[routerLinkActive]',
    exportAs: 'routerLinkActive',
})
export class RouterLinkActive implements OnChanges,
    OnDestroy, AfterContentInit {

    @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;
    @ContentChildren(RouterLinkWithHref, {descendants: true})
    linksWithHrefs: QueryList<RouterLinkWithHref>;

    private classes: string[] = [];
    private subscription: Subscription;
    private active: boolean = false;

    @Input() routerLinkActiveOptions: { exact: boolean } = {exact: false};

    constructor(private router: Router, private element: ElementRef, private renderer: Renderer2,
                private cdr: ChangeDetectorRef) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigateEvent) {
                this.update();
            }
        });
    }

    get isActive(): boolean {
        return this.active;
    }

    ngAfterContentInit(): void {
        this.links.changes.subscribe(_ => this.update());
        this.linksWithHrefs.changes.subscribe(_ => this.update());
        this.update();
    }

    @Input()
    set routerLinkActive(data: string[] | string) {
        const classes = Array.isArray(data) ? data : data.split(' ');
        this.classes = classes.filter(c => !!c);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private update(): void {
        if (!this.links || !this.linksWithHrefs) return;
        const hasActiveLinks = this.hasActiveLinks();

        // react only when status has changed to prevent unnecessary dom updates
        if (this.active !== hasActiveLinks) {
            this.classes.forEach((c) => {
                if (hasActiveLinks) {
                    this.renderer.addClass(this.element.nativeElement, c);
                } else {
                    this.renderer.removeClass(this.element.nativeElement, c);
                }
            });
            Promise.resolve(hasActiveLinks).then(active => this.active = active);
        }
    }

    private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterLink | RouterLinkWithHref) => {
            let urlState: UrlState = router.tab.current;
            if (!urlState || !urlState.segments || !link.segments) {
                return false;
            }
            // return router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
            return urlState.segments.join('/') == link.segments.join('/');
        };
    }

    private hasActiveLinks(): boolean {
        return this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    }
}
