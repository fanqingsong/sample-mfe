# 远程应用对比：product-feat vs fe-app-order-feat

> 本文档对比 Sample MFE 中两种远程微前端的集成方式：**路由模块式**（`product-feat` / `user-feat`）与 **Web Component 式**（`fe-app-order-feat`）。它们演示了微前端的两个典型诉求——同技术栈深度集成，与跨版本/异构技术栈隔离集成。

## 一句话对比

- `product-feat`：Angular 19 **Standalone + Module Federation 路由模块**，Host 用 `loadRemoteModule` 把它当**子路由**加载。
- `fe-app-order-feat`：Angular 16 **NgModule + Angular Elements**，打包成 **Web Component（自定义元素）**，Host 用 `WebComponentWrapper` 把它当**自定义标签**加载。

## 关键差异对照

| 维度 | `product-feat` | `fe-app-order-feat` |
|------|----------------|----------------------|
| 项目位置 | `fe-apps` monorepo 子工程 | **独立仓库**（自己的 `package.json`） |
| Angular 版本 | 19 | **16.2**（跨版本演示） |
| 组件形态 | Standalone Components | 传统 **NgModule** |
| 暴露内容 | `./routes`（`Routes` 数组） | `./web-components`（`bootstrap.ts`） |
| 暴露目标 | 路由模块 | **Angular Element 自定义元素** |
| Builder | `@angular-builders/custom-webpack` | `ngx-build-plus` |
| 启动方式 | `bootstrapApplication` | `@angular-architects/module-federation-tools` 的 `bootstrap(AppModule, { appType: 'microfrontend' })` |
| Host 加载方式 | `loadRemoteModule(...).then(m => m.routes)` → 子路由 | `WebComponentWrapper` + `elementName: 'fe-app-order-feat'` |
| `shared` 策略 | `singleton: true, strictVersion: true` | `singleton: false, strictVersion: false`（跨版本不能强单例） |
| 端口（本地开发） | 4102 | 4103 |
| 网关路径 | `/mf/product/` | `/mf/order/` |
| 后端配置中是否出现 | 是（`/api/routes` 可增删 products） | 否（在 Host 路由中写死） |

## 暴露配置对比

product-feat 暴露的是路由：

```js
// fe-apps/projects/product-feat/webpack.config.js
exposes: {
  './routes': './projects/product-feat/src/app/modules/modules.routes.ts',
}
```

order-feat 暴露的是 bootstrap（用于注册自定义元素）：

```js
// fe-app-order-feat/webpack.config.js
exposes: {
  './web-components': './src/bootstrap.ts',
}
```

## 注册自定义元素（order-feat 独有）

order-feat 用 `@angular/elements` 把组件注册成浏览器原生 Custom Element：

```ts
// fe-app-order-feat/src/app/app.module.ts
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('fe-app-order-feat', ce);

    customElements.define('fe-app-order-feat-a', createCustomElement(AComponent, { injector: this.injector }));
    customElements.define('fe-app-order-feat-b', createCustomElement(BComponent, { injector: this.injector }));
  }
}
```

注意 `bootstrap: []` 为空 —— NgModule 不自己启动，而是通过 `ngDoBootstrap` 手动注册 Custom Element。

## Host 端加载方式对比

product（路由式）—— 出现在 `getDynamicRoutes()` 生成的 `lazyRoutes` 里，由后端配置驱动：

```ts
{
  path: 'products',
  loadChildren: () => loadRemoteModule({
    type: 'module',
    remoteEntry: '/mf/product/remoteEntry.js',
    exposedModule: './routes'
  }).then(m => m.routes)
}
```

order（Web Component 式）—— 在 `modules.routes.ts` 里**单独写死**，不在后端配置中：

```ts
// fe-apps/projects/host/src/app/modules/modules.routes.ts
{
  path: 'orders',
  component: WebComponentWrapper,
  data: {
    type: 'module',
    remoteEntry: environment.ORDER_REMOTE_ENTRY + '?v=' + Math.random(),
    exposedModule: './web-components',
    elementName: 'fe-app-order-feat'
  } as WebComponentWrapperOptions
}
```

`elementName` 与上面 `customElements.define('fe-app-order-feat', ...)` 对应。

## 为什么要并存两种？

它们演示了微前端的两个典型诉求：

1. **product-feat / user-feat**：同技术栈（Angular 19）、共享运行时、深度集成（路由、共享依赖）—— 适合"同框架下的特性拆分"。
2. **fe-app-order-feat**：**跨 Angular 版本**（16 vs 19）、独立部署、技术栈隔离（自定义元素，不共享 Angular 运行时）—— 适合"异构/跨版本集成"，Host 只把它当成一个黑盒 DOM 标签，里面用什么版本 Angular 都无所谓。

这也是 order-feat 的 `shared` 用 `singleton: false, strictVersion: false` 的原因：跨大版本无法共享同一份 Angular，必须各自打包。

## 易忽略点：Builder 的差异

order-feat 用的是 `ngx-build-plus` 而非 `@angular-builders/custom-webpack`，这是因为 `@angular-architects/module-federation` 在 Angular 16 时代推荐通过 `ngx-build-plus` 接入自定义 webpack；Angular 17+ 才转向 `@angular-builders/custom-webpack`。两者都只是"把 `webpack.config.js` 接进 Angular 构建器"的不同适配层，不影响 Module Federation 本身的机制。

## 选型建议

| 场景 | 推荐方式 |
|------|----------|
| 同一 Angular 大版本、希望共享依赖、深度路由集成 | 路由模块式（`./routes` + `loadRemoteModule`） |
| 跨 Angular 版本、异构框架、强隔离、独立部署 | Web Component 式（`./web-components` + `WebComponentWrapper`） |
| 需要运行时插拔（特性开关） | 路由模块式 + 后端配置中心（参考 `product-feat`） |
| 需要把组件嵌入非 Angular 宿主 | Web Component 式（自定义元素可被任何前端消费） |

## 关键文件索引

| 用途 | 路径 |
|------|------|
| product-feat MF 配置 | `fe-apps/projects/product-feat/webpack.config.js` |
| product-feat 暴露的路由 | `fe-apps/projects/product-feat/src/app/modules/modules.routes.ts` |
| order-feat MF 配置 | `fe-app-order-feat/webpack.config.js` |
| order-feat 自定义元素注册 | `fe-app-order-feat/src/app/app.module.ts` |
| order-feat bootstrap | `fe-app-order-feat/src/bootstrap.ts` |
| Host 加载 order（WebComponentWrapper） | `fe-apps/projects/host/src/app/modules/modules.routes.ts` |
| Host 加载 product（loadRemoteModule） | `fe-apps/projects/host/src/app/modules/modules.routes.ts`（`getDynamicRoutes`） |
