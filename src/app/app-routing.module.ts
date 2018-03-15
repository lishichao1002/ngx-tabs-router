import {NgModule} from '@angular/core';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {Demo3Component} from './demo/demo3.component';
import {NotFoundComponent} from './demo/404.component';
import {UniqueKeyService} from './uniquekey.service';
import {Routes} from './router/pojo/route';
import {RouterModule} from './router/router.module';

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
        component: Demo3Component,
        uniqueKey: UniqueKeyService
    },
    {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
    },
    {
        title: '404',
        path: '404',
        component: NotFoundComponent
    },
    {
        title: '404',
        path: '(.*)',
        redirectTo: '/404'
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
