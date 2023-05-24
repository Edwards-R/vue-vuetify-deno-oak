import TestController from "../controller/TestController.ts";

export const exampleRoutes = (router: any) => {
    router.get("/", ({ response }: { response: any } ) => {
        response.body = {
            message: "Hello world",
        };
    });

    router.get("/test", TestController.DoTest);
}