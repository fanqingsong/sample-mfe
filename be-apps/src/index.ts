import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';

const app = new Hono()

app.use('/*', cors())

const userRemoteEntry =
  process.env.USER_REMOTE_ENTRY ?? '/mf/user/remoteEntry.js?v=1'
const productRemoteEntry =
  process.env.PRODUCT_REMOTE_ENTRY ?? '/mf/product/remoteEntry.js?v=1'

let dynamicRoutes = [
  {
    id: 'users',
    type: 'module',
    remoteEntry: userRemoteEntry,
    exposedModule: './routes',
    ngModuleName: 'routes',
    displayName: 'Users',
    routePath: 'users',
  }
];

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/routes', (c) => {
  return c.json(dynamicRoutes);
});

app.post('/routes', async (c) => {
  if (!dynamicRoutes.some(route => route.id === 'products')) {
    dynamicRoutes.push({
      id: 'products',
      type: 'module',
      remoteEntry: productRemoteEntry,
      exposedModule: './routes',
      ngModuleName: 'routes',
      displayName: 'Products',
      routePath: 'products',
    });
  }
  return c.json(dynamicRoutes);
});

app.delete('/routes', async (c) => {
  dynamicRoutes = dynamicRoutes.filter(route => route.id !== 'products');
  return c.json(dynamicRoutes);
});

const port = Number(process.env.PORT ?? 3000)
console.log(`Server is running on port ${port}`)
console.log(`USER_REMOTE_ENTRY=${userRemoteEntry}`)
console.log(`PRODUCT_REMOTE_ENTRY=${productRemoteEntry}`)

serve({
  fetch: app.fetch,
  port
})
