import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "https://deno.land/std@0.188.0/dotenv/load.ts";

const client = new Client({
    user: Deno.env.get('DB_USER'),
    database: Deno.env.get('DB_NAME'),
    hostname: Deno.env.get('DB_HOSTNAME'),
    port: parseInt(Deno.env.get('DB_PORT')!),
    password: Deno.env.get('DB_PASSWORD'),
})

await client.connect();

export default client;