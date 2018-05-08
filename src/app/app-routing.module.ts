import {NgModule} from '@angular/core';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {Demo3Component} from './demo/demo3.component';
import {NotFoundComponent} from './demo/404.component';
import {RouterModule, Routes} from './router/router.module';

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
        path: 'demo3/:name',
        component: Demo3Component
    },
    {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: '404',
        component: NotFoundComponent
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
