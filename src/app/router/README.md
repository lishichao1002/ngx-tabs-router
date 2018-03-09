# NgxTabsRouter


## [Uri parse](https://github.com/pillarjs/path-to-regexp)
`Route -->      http://localhost:8000/bbs/section/:id?language=01&product=02&locale=zh_CN#fragment`

`Uri -->     	http://localhost:8000/bbs/section/1?language=01&product=02&locale=zh_CN#1`

|	对应url的部分				      |	    对应解析后的值   |		解析后的值     |
|-------------------------|-------------------|--------------------|
|	/bbs/section/1	 	  |   pathParams      |	 pathParams={id:1}   |
|	?language=01&product=02&locale=zh_CN		      |     queryParams  	  |   queryParams={language:'01',product:'02',locale:'zh_CN'} |
|	#1 		      | fragment 		|			fragment=1 |
|	Uri 		      | params 		|			params={...queryParams, ...pathParams} |


## Router outelet

```xml
<router-tabs></router-tabs>
```


## Router service

### Tab页间(全局)

```js
//tabs
router.tabs: Obserable<RouterTab>
router.tab: RouterTab
router.addTab: void
router.selectTab: void
router.removeTab: void
router.navigate: void
router.navigateByUrl: void

//tab变化、url变化等生命周期事件
router.events: Obserable<Event>

//所有tab的参数变化都会触发这些事件
router.params: Obserable<Params>
router.pathParams: Obserable<PathParams>
router.queryParams: Obserable<QueryParams>
router.fragment: Obserable<Fragment>

//快照
router.snapshot.params: Params
router.snapshot.pathParams: PathParams
router.snapshot.queryParams: QueryParams
router.snapshot.fragment: Fragment

//会触发当前tab的前进后退
router.canGo: boolean
router.go: void
router.canBack: boolean
router.back: void

//tab页内跳转 或 tab页间切换 时会刷新前进后退
router.canGo$: Obserable<boolean>
router.canBack$: Obserable<boolean>
```

###  Tab页内(局部)
```js
//tabId
router.tab.tabId

//只有所在tab页的参数变化才会触发这些事件
router.tab.params: Obserable<Params>
router.tab.pathParams: Obserable<PathParams>
router.tab.queryParams: Obserable<QueryParams>
router.tab.fragment: Obserable<Fragment>

//快照
router.tab.snapshot.params: Params
router.tab.snapshot.pathParams: PathParams
router.tab.snapshot.queryParams: QueryParams
router.tab.snapshot.fragment: Fragment

//当前tab页前进后退
router.tab.go: void
router.tab.canGo: boolean
router.tab.back: void
router.tab.canBack: boolean

//tab页内跳转时会刷新前进后退
router.tab.canGo$: Obserable<boolean>
router.tab.canBack$: Obserable<boolean>
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


