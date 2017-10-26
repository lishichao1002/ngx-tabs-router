# NgxTabsRouter


## Router指令

```xml
<router-tabs></router-tabs>
```

## Router服务

```js
get params(): Observable<Params>

get events(): Observable<any>

get snapshot(): Params

tabId(): number

addTab(): void

selectTab(tabId: number): void

removeTab(tabId: number): void

navigate(commands: any[] | string, extras?: NavigationExtras)

navigateByUrl(commands: any[] | string, extras?: NavigationExtras)

canGo(): boolean

get canGo$(): Observable<boolean>

canBack(): boolean

get canBack$(): Observable<boolean>

go(): void

back(): void

```

## routerLink指令

```
<a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
   link to user component
</a>
```

## routerLinkActive指令

```
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>

<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
   <a routerLink="/user/jim">Jim</a>
   <a routerLink="/user/bob">Bob</a>
</div>
```

