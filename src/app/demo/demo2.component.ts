import {Component} from '@angular/core';
import {Router} from '../router/router';

@Component({
    selector: 'demo2',
    template: `
        <h1>Demo 2</h1>
    `
})
export class Demo2Component {

    constructor(private router: Router) {
    }

    private _mytab: any;

    private _des: any;

    ngOnInit() {
        this._mytab = this.router.tabId();

        this._des = this.router.params.subscribe((params) => {
            console.warn('demo2 router params: ', params, this._mytab, this.router.tabId());
        });
    }

    ngOnDestroy() {
        this._des.unsubscribe();
    }

}