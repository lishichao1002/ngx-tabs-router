import {NgModule} from '@angular/core';
import {RouterModule} from './router/router.module';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {Routes} from './router/types';

const routes: Routes = [
    {
        path: 'demo1',
        component: Demo1Component
    },
    {
        path: 'demo2',
        component: Demo2Component
    },
    {
        path: 'demo2/:a',
        component: Demo2Component
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
