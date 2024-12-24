import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  connectionString: String(process.env.DB_URL),
});

db.connect((error) => {
    if (error) {
        console.error(error)
        process.exit()
    }
    console.log("Database Connected!")
})

export default db