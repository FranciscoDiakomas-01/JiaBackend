import fs from 'node:fs'
import path from 'node:path'
import db from "./dbConection";
export async function runMigrations() {
    console.log(`Starting run migrations at ${Date.now()}`)
    fs.readdir(path.join(process.cwd() + '/Sql'), (err, files) => {
        
        if (err) {
            console.log(err)
        }else if (files?.length == 0) {
            console.log("Empty Sql")
        } else {
            files.forEach(file => {
                fs.readFile(path.join(process.cwd() + '/Sql/' + file), async (err, querySql) => {
                    const query = querySql?.toString()
                    await db.query(query, (err, result) => {
                        if (err) {
                            console.log(err.message)
                        }
                    })
                })
            })
        }
    })
    console.log(`Finished run migrations at ${Date.now()}`);
}