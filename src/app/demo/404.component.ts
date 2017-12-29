import {Component} from '@angular/core';
import {Router} from '../router/router';

@Component({
    selector: 'not-found',
    template: `
        <h1>404</h1>
    `
})
export class NotFoundComponent {

    constructor(private router: Router) {
    }

    ngOnInit() {
        console.warn('-------------------------------------------------');
        console.log('404 init');
    }

    ngOnDestroy() {
        console.log('404 destroy');
    }

}