import {Params, PathParams, QueryParams} from './params';
import {Fragment} from './url_state';

export class Snapshot {

    constructor(public params: Params,
                public pathParams: PathParams,
                public queryParams: QueryParams,
                public fragment: Fragment) {

    }

}