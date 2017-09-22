import {Route, RouteX} from './types';

let tabId: number = 0;

export class RouterTab {

    selected: boolean;

    private _tabId: number;
    private _stack_pointer: number;
    private _stack: RouteX[];
    private _current: RouteX;

    constructor() {
        this.selected = true;
        this._tabId = ++tabId;
        this._stack = [];
        this._stack_pointer = -1;
    }

    get current(): RouteX {
        return this._current;
    }

    get tabId(): number {
        return this._tabId;
    }

    addRoute(route: RouteX) {
        if (this.canGo()) {
            this._stack = this._stack.slice(0, this._stack_pointer);
        }
        this._stack.push(route);
        this._stack_pointer++;
        this._current = route;
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
    }

    go() {
        if (this.canGo()) {
            this._stack_pointer++;
            this._current = this._stack[this._stack_pointer];
        }
    }
}
