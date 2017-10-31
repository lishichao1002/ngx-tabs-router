# NgxTabsRouter

## Uri parse
`http://localhost:8000/bbs/section/:id?language=01&product=02&locale=zh_CN#fragment`

**bbs/section/:id **		--> 	**route path**

**:id**						--> 	**path params**

**language=01&product=02&locale=zh_CN**  --> **query params**

**#fragment**				--> 	**fragment**


## Router outelet

```xml
<router-tabs></router-tabs>
```


## Router service

### Tab页间(全局)

```js
//tabs
router.tabs
router.addTab
router.selectTab
router.removeTab
router.navigate
router.navigateByUrl

//所有tab的参数变化都会触发这些事件
router.params
router.pathParams
router.queryParams
router.fragment

//快照
router.snapshot.params
router.snapshot.pathParams
router.snapshot.queryParams
router.snapshot.fragment

//会触发当前tab的前进后退
router.canGo
router.go
router.canBack
router.back

//tab页内跳转 或 tab页间切换 时会刷新前进后退
router.canGo$
router.canBack$
```

###  Tab页内(局部)
```js
//只有所在tab页的参数变化才会触发这些事件
router.tab.params
router.tab.pathParams
router.tab.queryParams
router.tab.fragment

//快照
router.tab.snapshot.params
router.tab.snapshot.pathParams
router.tab.snapshot.queryParams
router.tab.snapshot.fragment

//当前tab页前进后退
router.tab.go
router.tab.canGo
router.tab.back
router.tab.canBack

//tab页内跳转时会刷新前进后退
router.tab.canGo$
router.tab.canBack$
```


## routerLink

```xml
<a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
   link to user component
</a>
```

## routerLinkActive

```xml
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>

<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
   <a routerLink="/user/jim">Jim</a>
   <a routerLink="/user/bob">Bob</a>
</div>
```


