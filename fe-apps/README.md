# FeApp (Nx + Angular Module Federation)

Angular 19 monorepo managed by **Nx**. Apps live under `apps/` with per-project `project.json`.

## Commands

```bash
npm run start:host      # nx serve host       (4200)
npm run start:user      # nx serve user-feat  (4101)
npm run start:product   # nx serve product-feat (4102)
npm run all             # MF dev server (all remotes)
npm run build:all       # nx run-many -t build
npx nx graph            # project graph
```

## Structure

```
apps/
  host/           # shell / host
  user-feat/      # remote
  product-feat/   # remote
libs/             # shared libs (empty placeholder)
nx.json
tsconfig.base.json
```

## Module Federation

Still uses `@angular-architects/module-federation` + `@angular-builders/custom-webpack`.
Nx migration skipped auto-rewriting those builders; targets were kept and paths updated to `apps/`.

## Note on order-feat

`fe-app-order-feat` stays a separate Angular 16 workspace (Web Component remote).
`@nx/angular` currently targets Angular >= 19, so it is not imported into this Nx workspace.
