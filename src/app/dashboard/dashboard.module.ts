import {NgModule} from '@angular/core';
// containers
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from '../router/router.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: DashboardComponent}
        ])
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule {
}