import {ChangeDetectionStrategy, Component, Input, Type} from '@angular/core';

@Component({
    selector: 'tab-router',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngComponentOutlet="component"></ng-container>
    `
})
export class TabRouterComponent {

    @Input() component: Type<any>;

    @Input() tabId: number;
}