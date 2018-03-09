export class Event {
    constructor() {
    }
}

export class NavigateEvent extends Event {
    constructor(/** @docsNotRequired */
                public mode: 'pushState' | 'replaceState',
                public url: string) {
        super();
    }
}

export class AddTabEvent extends Event {
    public mode = 'replaceState';

    constructor(/** @docsNotRequired */
                public url: string) {
        super();
    }
}

export class SwitchTabEvent extends Event {

    public mode = 'replaceState';

    constructor(/** @docsNotRequired */
                public url: string) {
        super();
    }
}

export class RemoveTabEvent extends Event {

    constructor() {
        super();
    }
}