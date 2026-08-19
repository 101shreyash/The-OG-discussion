import "dotenv/config"
import {Pool} from "pg"

const pool = new Pool({


    database : process.env.DATABASE,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST

})

export default pool;