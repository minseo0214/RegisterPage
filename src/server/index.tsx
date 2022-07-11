import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { createPool, sql } from 'slonik'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
const SECRET_KEY = 'MySecretKey1$1$234'

if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError')
  error.message = 'Secret key for JWT is missing.'
  throw error
}

const generateToken = (payload: any, options: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'songc.io', // 출처명
    expiresIn: '7d', // 유효기간
    ...options,
  }
  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err)
      token ? resolve(token) : false
    })
  })
}

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
    sql`select password from users where email=${email}`
  )
  const data = (await dbPassword).rows
  const check = await bcrypt.compare(password, data[0].password)
  if (check) {
    const accessToken = await generateToken(
      { user_id: data[0].user_id },
      { subject: 'access_token', expiresIn: '1h' }
    )
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    ctx.response.status = 200
  } else {
    ctx.status = 400
  }
})

router.get('/:loginEmail', async (ctx) => {
  const { loginEmail } = ctx.params
  const userId = await pool.query(
    sql`select id from users where email=${loginEmail}`
  )
  ctx.body = JSON.stringify(userId)
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
