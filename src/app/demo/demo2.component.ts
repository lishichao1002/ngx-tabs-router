import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'demo2',
    template: `
        <h1>Demo 2</h1>
    `
})
export class Demo2Component implements OnInit, OnDestroy {
    ngOnInit(): void {
        console.log('demo2 init');
    }

    ngOnDestroy(): void {
        console.log('demo2 destroy');
    }

}