import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  database: String(process.env.DB_NAME),
  host: String(process.env.DB_HOST),
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  user: String(process.env.DB_USER),
});

db.connect((error) => {
    if (error) {
        console.error(error)
        process.exit()
    }
    console.log("Database Connected!")
})

export default db