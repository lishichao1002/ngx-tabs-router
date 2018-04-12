import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, HostBinding, Input} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterTab} from '../router_tab';
import {Router} from '../router';

@Component({
    selector: 'router-tab',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <ng-container *ngComponentOutlet="tab?.current?.route?.component"></ng-container>
    `
})
export class RouterTabComponent {

    @HostBinding('class.hidden')
    @Input() hidden: boolean;
    @Input() tab: RouterTab;

    constructor(private titleService: Title,
                private router: Router,
                private resolver: ComponentFactoryResolver) {
    }

}