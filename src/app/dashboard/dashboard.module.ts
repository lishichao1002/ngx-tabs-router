import {NgModule} from '@angular/core';
// containers
import {DashboardComponent} from './dashboard.component';
import {Routes} from '../router/pojo/route';
import {RouterModule} from '../router/router.module';

// routes
export const ROUTES: Routes = [
    {path: '', component: DashboardComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule {
}