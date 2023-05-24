import RedlistService from "../service/RedlistService.ts";

class TestController {
    async DoTest(ctx:any):Promise<any> {
        ctx.response.body = {
            count: await RedlistService.SurCount(),
        }
    }
}

export default new TestController();