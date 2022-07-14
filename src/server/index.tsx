import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { createPool, sql } from 'slonik'
import bcrypt from 'bcrypt' //bcrpyt를 external로 처리해서 bundling이 안되도록 합니다.
import jwt, { SignOptions } from 'jsonwebtoken'
// review: jsonwebtoken 패키지로 다 해결해야 합니다.

// env파일을 최상위 폴더에 놓고,띄어쓰기 없이 작성해야함.
const SECRET_KEY = process.env.SECRET_KEY
const url = process.env.DB_URL

if (!SECRET_KEY) {
  throw new Error('Secret key for JWT is missing.')
}

if (!url) {
  throw new Error('DB URL이 잘못되었습니다.')
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

const decodeToken = (token: string | undefined) => {
  if (typeof token !== 'string') {
    return { check: false }
  }
  const base64Payload = token.split('.')[1]
  if (typeof base64Payload !== 'string') {
    return { check: false }
  }
  const payload = Buffer.from(base64Payload, 'base64')
  const result = JSON.parse(payload.toString())
  return { check: true, userId: result.id }
}

const app = new Koa()
app.use(bodyParser())
const router = new Router()

const pool = createPool(url)

pool.connect(async (connection) => {
  await connection.query(sql`SELECT * FROM users`)
})

const regex = /^(\/)(\w*)(\/?)$/
router.get(regex, async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
})

router.post('/api/login', async (ctx) => {
  const { email, password } = ctx.request.body
  const savedPasswordAndUserId = (
    await pool.query(sql`select id, password from users where email=${email}`)
  ).rows[0]

  if (typeof savedPasswordAndUserId?.password !== 'string') {
    return (ctx.status = 400)
  }

  const check = await bcrypt.compare(password, savedPasswordAndUserId?.password)

  if (check) {
    const accessToken = await generateToken(
      { id: savedPasswordAndUserId?.id },
      { subject: 'access_token', expiresIn: '1d' }
    )
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    ctx.status = 200
  } else {
    ctx.status = 400
  }
})

router.get('/api/login/:loginEmail', async (ctx) => {
  const { loginEmail } = ctx.params

  if (typeof loginEmail !== 'string') return (ctx.status = 400)

  const savedUserName = (
    await pool.query(sql`select name from users where email=${loginEmail}`)
  ).rows[0]?.name
  ctx.response.body = JSON.stringify(savedUserName)
  console.log(ctx.response.body)
  ctx.status = 200
})

router.post('/api/user', async (ctx) => {
  const { name, email, password } = ctx.request.body
  const encrypt = await bcrypt.hash(password, 10)
  await pool.query(
    sql`INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${encrypt})`
  )
  ctx.status = 200
})

router.get('/api/feed', async (ctx) => {
  const feedListData = (
    await pool.query(
      sql`SELECT feed.id, users.name, feed.text FROM feed INNER JOIN users ON feed.user_id = users.id ORDER BY feed.date DESC`
    )
  ).rows
  ctx.response.body = JSON.stringify(feedListData)
  ctx.status = 200
})

router.post('/api/feed', async (ctx) => {
  const { text } = ctx.request.body
  const token = ctx.request.header.cookie

  const { check, userId } = decodeToken(token)
  if (check === false) return (ctx.status = 400)
  await pool.query(
    sql`insert into feed(user_id,text) values (${userId},${text})`
  )
  ctx.status = 200
})

router.delete('/api/feed/:id', async (ctx) => {
  const { id } = ctx.params
  const token = ctx.request.header.cookie

  const { check, userId } = decodeToken(token)

  if (check === false) return (ctx.status = 400)
  if (id === undefined) return (ctx.status = 400)

  const feedUserId = (
    await pool.query(sql`select user_id from feed where id=${id}`)
  ).rows[0]?.user_id

  if (feedUserId === userId) {
    await pool.query(sql`delete from feed where id=${id}`)
  }
  ctx.status = 200
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
