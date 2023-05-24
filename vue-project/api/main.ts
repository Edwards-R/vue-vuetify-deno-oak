import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { router } from "./router.ts";

const app = new Application();
const port = 8000;

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("App running on port ", port);

await app.listen({port: port});