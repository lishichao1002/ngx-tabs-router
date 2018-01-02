import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {AppRoutingModule} from './app-routing.module';
import {Demo3Component} from './demo/demo3.component';
import {RouterNavComponent} from './router-nav/router-nav.component';
import {NotFoundComponent} from './demo/404.component';
import {UniqueKeyService} from './uniquekey.service';

@NgModule({
    declarations: [
        AppComponent,
        Demo1Component,
        Demo2Component,
        Demo3Component,
        NotFoundComponent,
        RouterNavComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        UniqueKeyService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
