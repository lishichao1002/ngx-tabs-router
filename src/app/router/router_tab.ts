import {Observable} from 'rxjs/Observable';
import {Snapshot} from './pojo/snapshot';
import {UrlState} from './pojo/url_state';

let tabId: number = 0;

export class RouterTab {

    public selected: boolean;

    private _tabId: number;
    private _stack: UrlState[];
    private _stack_pointer: number;
    private _pre: UrlState;
    private _current: UrlState;

    constructor(initState: UrlState) {
        this._tabId = ++tabId;
        this._stack = [];
        this._stack_pointer = -1;
        this._current = initState;
    }

    get tabId(): number {
        return this._tabId;
    }

    get pre(): UrlState {
        return this._pre;
    }

    get current(): UrlState {
        return this._current;
    }

    get params(): Observable<void> {
        return null;
    }

    get pathParams(): Observable<void> {
        return null;
    }

    get queryParams(): Observable<void> {
        return null;
    }

    get fragment(): Observable<string> {
        return null;
    }

    get snapshot(): Snapshot {
        return null;
    }

    navigate(urlState: UrlState) {
        if (this.canGo()) {
            this._stack.splice(this._stack_pointer, this._stack.length - this._stack_pointer);
        }
        this._stack.push(urlState);
        this._stack_pointer++;
        this._pre = this._current;
        this._current = urlState;
        console.log(this.tabId, this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    canGo(): boolean {
        return this._stack_pointer < this._stack.length - 1;
    }

    canBack(): boolean {
        return this._stack_pointer > 0;
    }

    go() {
        if (this.canGo()) {
            this._stack_pointer++;
            this._current = this._stack[this._stack_pointer];
        }
        console.log(this.tabId, this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    back() {
        if (this.canBack()) {
            this._stack_pointer--;
            this._current = this._stack[this._stack_pointer];
        }
        console.log(this.tabId, this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    canGo$(): Observable<boolean> {
        return null;
    }

    canBack$(): Observable<boolean> {
        return null;
    }

}
