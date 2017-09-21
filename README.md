# NgxTabsRouter


## Router指令

```xml
<router-tabs>
    <router-tab [component]="BBSComponent" [tabid]="1" [current]="true"></router-tab>
    <router-tab [component]="LogComponent" [tabid]="2" [current]="false"></router-tab>
    <router-tab [component]="GSCComponent" [tabid]="3" [current]="false"></router-tab>
</router-tabs>
```

## Router服务

```js


// 打开新tab页并渲染默认组件   [压栈]-[浏览器压栈]
addTab(default_component: Component);

// 在当前tab页渲染新组件   [压栈]-[浏览器压栈]
addComponent(component: Component);

// 当前是否能够前进
canGo();

// 在当前tab页中前进   [不压栈]-[浏览器不压栈]
go();

// 当前是否能够后退
canBack();

// 在当前tab页中后退   [不压栈]-[浏览器不压栈]
back();

// 选中tab页   [压栈]-[浏览器压栈]
selectTab(tabId: number);

// 删除tab页   [清空栈]-[浏览器不压栈]
removeTab(tabId: number);

```

## Router事件

```
window.onpopstate = function(event){
    let {tabId, component} = event;
    if(router.current.tabId === tabId){
        // 选中tab
        addComponent(component);
    }else{
        alert('当前路由不可用');
    }
}
```
