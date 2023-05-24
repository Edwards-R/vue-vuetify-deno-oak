import TestController from "../controller/TestController";

export const exampleRoutes = (router: any) => {
    router.get("/test", TestController.DoTest);
}