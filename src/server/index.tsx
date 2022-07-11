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
  const { name, email, password } = ctx.request.body
  console.log(password)
  const encrypt = await bcrypt.hash(password, 10)
  console.log('in', encrypt)
  pool.query(
    sql`INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${encrypt})`
  )
  ctx.status = 200
})

router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body
  const dbPassword = pool.query(
    sql`select name,password from users where email=${email}`
  )
  const data = (await dbPassword).rows
  const check = await bcrypt.compare(password, data[0].password)
  if (check) {
    ctx.status = 200
    // POST 상태에서 정보를 전달할 수 있나?
    ctx.body = JSON.stringify(data[0].name)
  } else {
    ctx.status = 400
  }
})

router.get('/text', async (ctx) => {
  const data = await pool.query(sql`SELECT * FROM text ORDER BY date DESC`)
  ctx.body = JSON.stringify(data)
})

router.post('/text/:user_id', async (ctx) => {
  const { user_id } = ctx.params
  const { text } = ctx.request.body
  pool.query(sql`insert into text(user_id,text) values (${user_id},${text})`)
  ctx.status = 200
})

router.delete('/text/:id', async (ctx) => {
  const { id } = ctx.params
  pool.query(sql`delete from text where id=${id}`)
  ctx.status = 200
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
