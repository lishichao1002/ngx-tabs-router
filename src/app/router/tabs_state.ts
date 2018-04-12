import {Injectable} from '@angular/core';
import {RouterTab} from './router_tab';

@Injectable()
export class RouterState {

    tabs: RouterTab[] = [];

    constructor() {
    }


}