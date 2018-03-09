import {NgModule} from '@angular/core';
import {Demo1Component} from './demo/demo1.component';
import {Demo2Component} from './demo/demo2.component';
import {Demo3Component} from './demo/demo3.component';
import {NotFoundComponent} from './demo/404.component';
import {UniqueKeyService} from './uniquekey.service';
import {Routes} from './router/pojo/route';
import {RouterModule} from './router/router.module';

// require.ensure(['./test-import-async'], function (require) {
//     console.log('aaa');
//     var module2 = require('./test-import-async');
//     console.log('bbb', module2);
// });

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
        title: '404',
        path: '404',
        component: NotFoundComponent
    },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        // loadChildren: () => new Promise<any>(function (resolve, reject) {
        //     require.ensure(['./dashboard/dashboard.module'], (require) => {
        //         resolve(require('./dashboard/dashboard.module').DashboardModule);
        //     });
        // })
    },
    // {
    //     path: 'dashboard',
    //     loadChildren: loadChildren_1
    //     // loadChildren: () => import('./dashboard/dashboard.module').then((module) => module['DashboardModule'])
    // },
    {
        title: '404',
        path: '(.*)',
        redirectTo: '/404'
    },
    // {
    //     path: 'dashboard',
    //     loadChildren: './dashboard/dashboard.module#DashboardModule'
    // },

];

export function loadChildren_1() {
    return import('./dashboard/dashboard.module').then(m => {
        console.warn('xxxxxxxxxxxxxx', m);
        return m.DashboardModule;
    });
    // return import('./dashboard/dashboard.module.ngfactory').then(m => m.DashboardModuleNgFactory);
}

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
