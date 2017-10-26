import {UrlTree} from './pojo/url_tree';

let tabId: number = 0;

export class RouterTab {

    selected: boolean;

    private _tabId: number;
    private _stack_pointer: number;
    private _stack: UrlTree[];
    private _current: UrlTree;

    constructor() {
        this.selected = true;
        this._tabId = ++tabId;
        this._stack = [];
        this._stack_pointer = -1;
    }

    get current(): UrlTree {
        return this._current;
    }

    get tabId(): number {
        return this._tabId;
    }

    addRoute(route: UrlTree) {
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