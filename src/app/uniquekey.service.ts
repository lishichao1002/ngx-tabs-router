import {Injectable} from '@angular/core';
import {IRouteKey, Route} from './router/pojo/route';
import {Snapshot} from './router/pojo/snapshot';

@Injectable()
export class UniqueKeyService implements IRouteKey {

    getUniqueKey(route: Route, snapshot: Snapshot): string {
        console.log('snapshot.pathParams.name', snapshot.pathParams.name);
        return snapshot.pathParams.name;
    }
}