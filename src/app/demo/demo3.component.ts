import {Component} from '@angular/core';
import {Router} from '../router/router';

@Component({
    selector: 'demo3',
    template: `
        <h1>Demo 3</h1>
    `
})
export class Demo3Component {

    constructor(private router: Router) {
    }

    private _mytab: any;

    private _des: any;

    ngOnInit() {
        this._mytab = this.router.tabId();

        this._des = this.router.params.subscribe((params) => {
            console.warn('demo3 router params: ', params, this._mytab, this.router.tabId());
        });
    }

    ngOnDestroy() {
        this._des.unsubscribe();
    }

}