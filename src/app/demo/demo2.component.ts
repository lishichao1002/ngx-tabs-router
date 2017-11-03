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

    paramsDesc;
    pathParamsDesc;
    queryParamsDesc;
    fragmentDesc;

    ngOnInit() {
        console.warn('-------------------------------------------------');
        console.log('demo2 init');
        console.log('demo2 snapshot', this.router.tab.snapshot.toString());
        this.paramsDesc = this.router.tab.params.subscribe((params) => {
            console.log('demo2 params', params, this.router.tab.tabId);
        });
        this.pathParamsDesc = this.router.tab.pathParams.subscribe((pathParams) => {
            console.log('demo2 pathParams', pathParams, this.router.tab.tabId);
        });
        this.queryParamsDesc = this.router.tab.queryParams.subscribe((queryParams) => {
            console.log('demo2 queryParams', queryParams, this.router.tab.tabId);
        });
        this.fragmentDesc = this.router.tab.fragment.subscribe((fragment) => {
            console.log('demo2 fragment', fragment, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {
        console.log('demo2 destroy');
        this.paramsDesc.unsubscribe();
        this.pathParamsDesc.unsubscribe();
        this.queryParamsDesc.unsubscribe();
        this.fragmentDesc.unsubscribe();
    }

}