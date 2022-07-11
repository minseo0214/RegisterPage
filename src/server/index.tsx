import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import { createPool, sql } from 'slonik'

const app = new Koa()
const router = new Router()

const pool = createPool('postgresql://todo_user:todo_user@localhost/todos2')
pool.connect(async (connection) => {
  const data = await connection.query(sql`SELECT * FROM todo`)
  console.log(data)
})

router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
