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
In the project root, create the folder `api`. All back end code for the APIwill exist in here. All future commands for this chapter take place with thisas the root unless otherwise explicitly directed.

Create `main.ts` and `router.ts`.

Create the folder `service`. This is where the data services (the stuff that talks to the database) goes.

Create the folder `controller`. This is where the business logic goes. If the a route does more than three things before ending, move the logic into a controller to keep the routes thin.

Create the folder `data`. This is where calls to databases go. We'll handlethe connection to a database later.

Create the folder `routes`. This is where individual route collections willgo. For example, an API link for `api/species` which has a full CRUD wouldget a file called `species.ts` which lays out all the commands for that file.See the example for a template.

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
+ # API env
+ api/.env
```

Next, navigate back to `api` and create `.env`. Add the following

```
+ TESTVAL=test
```

Save, commit & push, then **check the remote repository**. You should **not** see the new .env file.