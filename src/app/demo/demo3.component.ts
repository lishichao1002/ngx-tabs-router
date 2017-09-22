import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'demo3',
    template: `
        <h1>Demo 3</h1>
    `
})
export class Demo3Component implements OnInit, OnDestroy {
    ngOnInit(): void {
        // console.log('demo2 init');
    }

    ngOnDestroy(): void {
        // console.log('demo2 destroy');
    }

}