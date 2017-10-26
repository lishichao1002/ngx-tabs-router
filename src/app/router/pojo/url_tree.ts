import {Route} from './route';
import * as URI from 'urijs';

export type UrlSegment = string;

export class UrlTree {

    /** <base href=''/> */
    public baseUrl: string;

    public route: Route;

    constructor(/** The segment group of the URL tree */
                public segments: UrlSegment[],
                /** The query params of the URL */
                public queryParams: { [key: string]: string },
                /** The fragment of the URL */
                public fragment: string | null) {
    }

    toString() {
        return new URI(`${this.baseUrl}${this.segments.join('/')}`)
            .query(this.queryParams)
            .fragment(this.fragment)
            .toString();
    }
}

export function parseToUrlTree(absolutePath: string): UrlTree {
    return null;
}