import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { createPool, sql } from 'slonik'
import bcrypt from 'bcryptjs'

const app = new Koa()
app.use(bodyParser())
const router = new Router()

const pool = createPool(
  'postgresql://todo_user:todo_user@localhost/user_inform'
)
pool.connect(async (connection) => {
  const data = await connection.query(sql`SELECT * FROM users`)
})

router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
})

router.post('/user', async (ctx) => {
  console.log(ctx.request.body)
  const { name, email, password } = ctx.request.body
  const encrypt = bcrypt.hashSync(password, 10)
  pool.query(
    sql`INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${encrypt})`
  )

  ctx.status = 200
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
