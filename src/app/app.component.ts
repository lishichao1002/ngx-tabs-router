import {Component} from '@angular/core';
import {TabsStore} from './router/tabs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private tabsStore: TabsStore) {

    }

    addTab() {
        this.tabsStore.addTab();
    }

}
