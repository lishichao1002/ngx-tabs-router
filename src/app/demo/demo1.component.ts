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

    paramsDesc;
    pathParamsDesc;
    queryParamsDesc;
    fragmentDesc;

    ngOnInit() {
        console.warn('-------------------------------------------------');
        console.log('demo1 init');
        console.log('demo1 snapshot', this.router.tab.snapshot.toString());
        this.paramsDesc = this.router.tab.params.subscribe((params) => {
            console.log('demo1 params', params, this.router.tab.tabId);
        });
        this.pathParamsDesc = this.router.tab.pathParams.subscribe((pathParams) => {
            console.log('demo1 pathParams', pathParams, this.router.tab.tabId);
        });
        this.queryParamsDesc = this.router.tab.queryParams.subscribe((queryParams) => {
            console.log('demo1 queryParams', queryParams, this.router.tab.tabId);
        });
        this.fragmentDesc = this.router.tab.fragment.subscribe((fragment) => {
            console.log('demo1 fragment', fragment, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {
        console.log('demo1 destroy');
        this.paramsDesc.unsubscribe();
        this.pathParamsDesc.unsubscribe();
        this.queryParamsDesc.unsubscribe();
        this.fragmentDesc.unsubscribe();
    }
}