# vue-vuetify-deno-oak
A start point for vue &amp; vuetify &amp; deno &amp; oak


## Front-end creation instructions

### Vue

Install vue:

`npm init vue@latest`

(This version of Vue is 3.6.4)

> Typescript?   Yes

> JSX?          No

> Router?       Yes

> Pinia?        No (This is for RESTful so no states)

> Vitest?       Yes (This is a foundation so unit tests would be smart...)

> End-to-end?   No (not a clue hwo to use them right now)

> ESLint?        Yes

> Prettier?      Yes (Good code and consistent formatting = win)

Go into the folder and then run the following to

* install the default libraries
* format the code according to the styling libraries
* run the dev server for testing

```
npm install
npm run format
npm run dev
```

Go to the supplied URL and verify that you get the Vue start page

Stop the server with `ctrl - c`

### Vuetify

This installs Vuetify with treeshaking, as per https://vuetifyjs.com/en/features/treeshaking/

From inside the project directory, install the vite-ready version of vuetify:

```
npm i vite-plugin-vuetify
```

Edit `vite.config.ts`:

```
+ import vuetify from 'vite-plugin-vuetify'

- plugins: [vue()],

+ plugins: [
+   vue(),
+   vuetify(),
+ ],
```

Make the folder 'plugins' under `src`

Make `vuetify.ts` inside the newly created `plugins` folder

Add the folowing to `vuetify.ts`:
```
+ import { createVuetify } from 'vuetify'
+ import 'vuetify/styles'
+ 
+ export default createVuetify({});
```



Now go to `main.ts` and add the following
```
+ import createVuetify from './plugins/vuetify'
```
...

```
  app.use(router)
+ app.use(createVuetify)
```

### MDI font install

Install via npm:

```
npm install @mdi/font -D
```

Modify `src/plugins/vuetify.ts` to have the following import:

```
+ import '@mdi/font/css/materialdesignicons.css'
```

### Add a proxy for the api

Add the following to `vite.config.ts` under `defineConfig`:

```
+ server: {
+   proxy: {
+     '/bwars':{
+       target: 'http://localhost:8000',
+       changeOrigin: true,
+       rewrite: (path) => path.replace(/^\/bwars/, ''),
+     }
+   }
+ }
```

Change the target URL if needed

Addresses that start with `bwars` will now redirect to the target e.g.
`/bwars/api/get` -> `http://localhost:8000/api/get`


## Back-end creation instructions
In the project root, create the folder `api`. All back end code for the APIwill exist in here. All future commands for this chapter take place with this as the root unless otherwise explicitly directed.

Create `main.ts` and `router.ts`.

Create the folder `service`. This is where the data services (the stuff that talks to the database) goes.

Create the folder `controller`. This is where the business logic goes. If the a route does more than three things before ending, move the logic into a controller to keep the routes thin.

Create the folder `data`. This is where calls to databases go. We'll handle the connection to a database later.

Create the folder `route`. This is where individual route collections willgo. For example, an API link for `api/species` which has a full CRUD wouldget a file called `species.ts` which lays out all the commands for that file.See the example for a template.

In `router.ts` add

```
+ import { Router } from "https://deno.land/x/oak/mod.ts";

+ export const router = new Router();
```
We will add the routes to this later. Right now it's just a router doing nothing since it has no routes to direct traffic to.

Inside `main.ts`, add
```
+ import { Application } from "https://deno.land/x/oak/mod.ts";
+ import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
+ import { router } from "./router.ts";
+ 
+ const app = new Application();
+ const port = 8000;
+ 
+ app.use(oakCors());
+ app.use(router.routes());
+ app.use(router.allowedMethods());
+ 
+ console.log("App running on port ", port);
+ 
+ await app.listen({port: port});
```

This adds oak (the middleware package), oakCors for cross-origin request specification, then importing the router so that the server knows about it. Note that the router still doesn't *do* anything. We then declare the app, tell it to use oakCors and the router we made earlier. Following that, we log a message to the console then tell the app to start.

## Back-end example code
This section delves deeper into the set up of a specific example in Deno/Oak. Follow for a better understanding of why the project is structured in the way that it is.

### Database and .env settings
This section handles *safely* connecting to a postgres database (though it can adapt to others) using a .env file to store the connection details.

The first step is telling git to NOT upload the .env file we are going to create. Experience has made this the first step, don't skip past here. Seriously. In the **project root folder**, find the `.gitignore` file and add the following:
```
+ # env
+ .env
```

Next, still in the project rpot, create `.env`. Add the following

```
+ TESTVAL=test
```

Save, commit & push, then **check the remote repository**. You should **not** see the new .env file. Check that you don't and *only then* proceed. If you do see the file, check your paths all match up and fix things so that the file gets ignored by git.

Now that we know that the .env file is secure we can put sensitive data in it. Replace the contents of `.env` with the following, modifying to use your database credentials:
```
- TESTVAL=test

+ DB_USER=your_db_user
+ DB_NAME=your_db_name
+ DB_HOSTNAME=your_hostname
+ DB_PORT=5432
+ DB_PASSWORD=your_passsword
```

Next, under `data`, add a new file with the name of the database that you are connecting to. For example, I will be connecting to the database I have prepared for Red List analysis of taxa, so I call my file `redlist_db.ts`. Add the following into this file:
```
+ import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
+ import "https://deno.land/std@0.188.0/dotenv/load.ts";
+ 
+ const client = new Client({
+     user: Deno.env.get('DB_USER'),
+     database: Deno.env.get('DB_NAME'),
+     hostname: Deno.env.get('DB_HOSTNAME'),
+     port: parseInt(Deno.env.get('DB_PORT')!),
+     password: Deno.env.get('DB_PASSWORD'),
+ })
+ 
+ await client.connect();
+ 
+ export default client;
```

Finally we can create some services to act as the data layer. This example will simply select a count from a table and return that value.

Create `service/ExampleService.ts`. Then add the following, modifying it to suit your situation. You will likely need to change the import to refer to your specific project, as well as change the table name that the query refers to:

```
+ import database from '../data/redlist_db.ts';
+ 
+ class ExampleService {
+     async SurCount():Promise<number>{
+         const data:any = (await database.queryObject("SELECT COUNT(*) FROM public.sur_mat")).rows;
+         return Number(data[0].count)
+     }
+ }
+ 
+ export default new ExampleService();
```

Next we need a place to call this from. Since this is one line it can be called directly from the route, but for the purpose of demonstration we will make a controller do it instead. Make `controller/ExampleController.ts` and add the following (modify the service name if needed):
```
+ import RedlistService from "../service/RedlistService.ts";
+ 
+ class TestController {
+     async CountSur(ctx:any):Promise<any> {
+         ctx.response.body = {
+             count: await RedlistService.SurCount(),
+         }
+     }
+ }
+ 
+ export default new TestController();
```

Now we need to make a route that calls this controller. Create `route/ExampleRoutes.ts` and then add the following, changing the Service import as needed:

```
+ import TestController from "../controller/TestController.ts";
+ 
+ export const exampleRoutes = (router: any) => {
+     router.get("/", ({ response }: { response: any } ) => {
+         response.body = {
+             message: "Hello world",
+         };
+     });
+     
+     router.get("/test", TestController.DoTest);
+ }
```

Now we tell the router that it needs to load in these routes. Modify `router.ts` to have the following:

```
  import { Router } from "https://deno.land/x/oak/mod.ts";
+ import { exampleRoutes } from "./route/ExampleRoutes.ts"

  export const router = new Router();
+ exampleRoutes(router);
```

This imports TestController and then runs the export, passing `router` as the router to have the routes assigned to.

### Make a script to run
Deno is super secure and safe. So safe that it requires multiple arguments to run every time, e.g. `deno run --allow-read --allow-env --allow-net api/main.ts`. To save us from having to remember or write this out, we can add it as a command to npm. From the project root, find `package.json` and add the following:
```
  {
    ...
    "scripts": {
      ...
+     "api": "deno run --allow-read --allow-env --allow-net api/main.ts"
    }
  }
```

You can now run the api by calling `npm run api`.

## Vue examples
### Fetch to read from the API
https://jasonwatmore.com/post/2020/04/30/vue-fetch-http-get-request-examples
