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

    paramsDesc;
    pathParamsDesc;
    queryParamsDesc;
    fragmentDesc;

    ngOnInit() {
        console.warn('-------------------------------------------------');
        console.log('demo3 init');
        console.log('demo3 snapshot', this.router.tab.snapshot.toString());
        this.paramsDesc = this.router.tab.params.subscribe((params) => {
            console.log('demo3 params', params, this.router.tab.tabId);
        });
        this.pathParamsDesc = this.router.tab.pathParams.subscribe((pathParams) => {
            console.log('demo3 pathParams', pathParams, this.router.tab.tabId);
        });
        this.queryParamsDesc = this.router.tab.queryParams.subscribe((queryParams) => {
            console.log('demo3 queryParams', queryParams, this.router.tab.tabId);
        });
        this.fragmentDesc = this.router.tab.fragment.subscribe((fragment) => {
            console.log('demo3 fragment', fragment, this.router.tab.tabId);
        });
    }

    ngOnDestroy() {
        console.log('demo3 destroy');
        this.paramsDesc.unsubscribe();
        this.pathParamsDesc.unsubscribe();
        this.queryParamsDesc.unsubscribe();
        this.fragmentDesc.unsubscribe();
    }

}