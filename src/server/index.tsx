import dotenv from 'dotenv'
dotenv.config({ path: '/.env' })
import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { createPool, sql } from 'slonik'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'

// const SECRET_KEY = process.env.SECRET_KEY

const SECRET_KEY = 'MySecretKey1$1$234'
const url = 'postgresql://todo_user:todo_user@localhost/user_inform'

if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError')
  error.message = 'Secret key for JWT is missing.'
  throw error
}

const generateToken = (payload: any, options: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'mins', // 출처명
    expiresIn: '7d', // 유효기간
    ...options,
  }
  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) {
        reject(err)
      }
      if (token) {
        resolve(token)
      }
    })
  })
}

const app = new Koa()
app.use(bodyParser())

const router = new Router()

//const url = process.env.DB_URL
if (!url) {
  throw console.error('DB URL이 잘못되었습니다.')
}
const pool = createPool(url)

pool.connect(async (connection) => {
  await connection.query(sql`SELECT * FROM users`)
})

router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
})

router.post('/user', async (ctx) => {
  const { name, email, password } = ctx.request.body
  const encrypt = await bcrypt.hash(password, 10)
  pool.query(
    sql`INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${encrypt})`
  )
  ctx.status = 200
})

router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body
  const savedPasswordAndUserId = (
    await pool.query(
      sql`select user_id, password from users where email=${email}`
    )
  ).rows[0]

  const check = await bcrypt.compare(
    password,
    String(savedPasswordAndUserId?.password)
  )
  if (check) {
    const accessToken = await generateToken(
      { user_id: savedPasswordAndUserId?.user_id },
      { subject: 'access_token', expiresIn: '1d' }
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

// // user Id를 전달하기 위해 만듬
// router.get('/user/:loginEmail', async (ctx) => {
//   const { loginEmail } = ctx.params
//   const userId = await pool.query(
//     sql`select id from users where email=${loginEmail}`
//   )
//   ctx.body = JSON.stringify(userId)
// })

router.get('/text', async (ctx) => {
  const data = await pool.query(sql`SELECT * FROM text ORDER BY date DESC`)
  ctx.response.body = JSON.stringify(data)
})

// review: 유저 아이디를 직접 받는 것은 잘못된 방식입니다. ctx의 cookie로부터 유저 정보를 알아내야 합니다.
router.post('/text', async (ctx) => {
  const { text } = ctx.request.body
  pool.query(sql`insert into text(text) values (${text})`)
  ctx.status = 200
})

router.delete('/text/:id', async (ctx) => {
  const { id } = ctx.params
  if (id === undefined) return
  pool.query(sql`delete from text where id=${id}`)
  ctx.status = 200
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
