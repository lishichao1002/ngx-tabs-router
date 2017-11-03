import {Observable} from 'rxjs/Observable';
import {Snapshot} from './pojo/snapshot';
import {Fragment, UrlState} from './pojo/url_state';
import {Params, PathParams, QueryParams} from './pojo/params';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

let tabId: number = 0;

export class RouterTab {

    /** @internal */
    public selected: boolean;

    private _tabId: number;
    private _stack: UrlState[];
    private _stack_pointer: number;
    private _pre: UrlState;
    private _current: UrlState;

    /** @internal */
    public readonly _paramsSubject: Subject<Params> = new BehaviorSubject({});
    /** @internal */
    public readonly _pathParamsSubject: Subject<PathParams> = new BehaviorSubject({});
    /** @internal */
    public readonly _queryParamsSubject: Subject<QueryParams> = new BehaviorSubject({});
    /** @internal */
    public readonly _fragmentSubject: Subject<Fragment> = new BehaviorSubject('');

    private _canGoSubject: Subject<boolean> = new BehaviorSubject(false);
    private _canBackSubject: Subject<boolean> = new BehaviorSubject(false);

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

    get params(): Observable<Params> {
        return this._paramsSubject.asObservable();
    }

    get pathParams(): Observable<PathParams> {
        return this._pathParamsSubject.asObservable();
    }

    get queryParams(): Observable<QueryParams> {
        return this._queryParamsSubject.asObservable();
    }

    get fragment(): Observable<Fragment> {
        return this._fragmentSubject.asObservable();
    }

    snapshot: Snapshot;

    navigate(urlState: UrlState) {
        if (this.canGo()) {
            this._stack.splice(this._stack_pointer, this._stack.length - this._stack_pointer);
        }
        this._stack.push(urlState);
        this._stack_pointer++;
        this._pre = this._current;
        this._current = urlState;
        this._canGoSubject.next(this.canGo());
        this._canBackSubject.next(this.canBack());
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
            this._canGoSubject.next(this.canGo());
            this._canBackSubject.next(this.canBack());
        }
        console.log(this.tabId, this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    back() {
        if (this.canBack()) {
            this._stack_pointer--;
            this._current = this._stack[this._stack_pointer];
            this._canGoSubject.next(this.canGo());
            this._canBackSubject.next(this.canBack());
        }
        console.log(this.tabId, this._stack_pointer, this._stack.map(item => item.route.title).join(','));
    }

    canGo$(): Observable<boolean> {
        return this._canGoSubject.asObservable();
    }

    canBack$(): Observable<boolean> {
        return this._canBackSubject.asObservable();
    }

}
