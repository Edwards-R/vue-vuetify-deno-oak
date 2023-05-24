import database from '../data/redlist_db.ts';

class RedlistService {
    async SurCount():Promise<number>{
        const data:any = (await database.queryObject("SELECT COUNT(*) FROM + public.sur_mat")).rows;
        return Number(data[0].count)
    }
}

export default new RedlistService();