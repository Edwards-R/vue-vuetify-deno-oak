import { Router } from "https://deno.land/x/oak/mod.ts";
import { exampleRoutes } from "./route/ExampleRoutes.ts"

export const router = new Router();
exampleRoutes(router);