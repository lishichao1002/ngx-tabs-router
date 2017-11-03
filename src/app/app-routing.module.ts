import {NgModule} from '@angular/core';
import {RouterModule} from './router/router.module';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {Demo3Component} from './demo/demo3.component';
import {Routes} from './router/pojo/route';

const routes: Routes = [
    {
        title: 'demo1',
        path: 'demo1',
        component: Demo1Component
    },
    {
        title: 'demo2',
        path: 'demo2',
        component: Demo2Component
    },
    {
        title: 'demo3',
        path: 'demo3/:name',
        component: Demo3Component
    },
    {
        title: 'otherwise',
        path: '(.*)',
        component: Demo3Component
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
