import {Component} from '@angular/core';
import {Router} from '../router/router';

@Component({
    selector: 'demo1',
    template: `
        <h1>Demo 1</h1>
    `
})
export class Demo1Component {

    constructor(private router: Router) {
    }

    private _mytab: number;

    private _des: any;

    ngOnInit() {
        console.log('demo1 init');

        this._mytab = this.router.tab.tabId;

        this._des = this.router.params.subscribe((params) => {
            console.warn('demo1 router params: ', params, this._mytab, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {
        console.log('demo1 destroy');
        this._des.unsubscribe();
    }
}