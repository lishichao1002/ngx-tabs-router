import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {AppRoutingModule} from './app-routing.module';
import {Demo3Component} from './demo/demo3.component';

@NgModule({
    declarations: [
        AppComponent,
        Demo1Component,
        Demo2Component,
        Demo3Component
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        Demo1Component,
        Demo2Component,
        Demo3Component
    ]
})
export class AppModule {
}
