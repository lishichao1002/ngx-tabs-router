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
        console.log('demo2 init');
        this._mytab = this.router.tab.tabId;

        this._des = this.router.params.subscribe((params) => {
            console.warn('demo2 router params: ', params, this._mytab, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {
        console.log('demo2 destroy');
        this._des.unsubscribe();
    }

}