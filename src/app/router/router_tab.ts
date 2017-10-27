import {UrlState} from './pojo/url_state';
import {RouterTabComponent} from './directive/router-tab.component';

let tabId: number = 0;

export class RouterTab {

    selected: boolean;

    outlet: RouterTabComponent;

    private _tabId: number;
    private _stack_pointer: number;
    private _stack: UrlState[];
    private _current: UrlState;

    constructor(initState: UrlState) {
        this.selected = true;
        this._tabId = ++tabId;
        this._stack = [];
        this._stack_pointer = -1;
        this._current = initState;
    }

    get current(): UrlState {
        return this._current;
    }

    get tabId(): number {
        return this._tabId;
    }

    addRoute(route: UrlState) {
        if (this.canGo()) {
            this._stack = this._stack.slice(0, this._stack_pointer);
        }
        this._stack.push(route);
        this._stack_pointer++;
        this._current = route;
        console.log(this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    canBack(): boolean {
        return this._stack_pointer > 0;
    }

    canGo(): boolean {
        return this._stack_pointer < this._stack.length - 1;
    }

    back() {
        if (this.canBack()) {
            this._stack_pointer--;
            this._current = this._stack[this._stack_pointer];
        }
        console.log(this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    go() {
        if (this.canGo()) {
            this._stack_pointer++;
            this._current = this._stack[this._stack_pointer];
        }
        console.log(this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }
}
