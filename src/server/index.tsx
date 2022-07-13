import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { createPool, sql } from 'slonik'
import bcrypt from 'bcrypt' //bcrpyt로 하면 3개의 error가 납니다. -> external로 처리해서 bundling이 안되도록
import jwt, { SignOptions } from 'jsonwebtoken'
// review: jsonwebtoken 패키지로 다 해결해야 합니다.

// env 사용이 안되는 이유를 모르겠습니다. -> .env파일을 아예 상위로 놓고,띄어쓰기 없이 작성해야함.
const SECRET_KEY = process.env.SECRET_KEY
const url = process.env.DB_URL

const app = new Koa()
app.use(bodyParser())

if (!SECRET_KEY) {
  throw new Error('Secret key for JWT is missing.')
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
    return false
  }
  const base64Payload = token.split('.')[1]
  if (typeof base64Payload !== 'string') {
    return false
  }
  const payload = Buffer.from(base64Payload, 'base64')
  const result = JSON.parse(payload.toString())
  return result.id
}

const router = new Router()

if (!url) {
  throw new Error('DB URL이 잘못되었습니다.')
}
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
    return
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
    ctx.response.status = 200
  } else {
    ctx.status = 400
  }
})

router.get('/api/login/:loginEmail', async (ctx) => {
  const { loginEmail } = ctx.params

  if (typeof loginEmail !== 'string') return
  const res = await pool.query(
    sql`select name from users where email=${loginEmail}`
  )
  const userName = res.rows[0]?.name
  ctx.response.body = JSON.stringify(userName)
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
  const data = await pool.query(
    sql`SELECT feed.id, users.name, feed.text FROM feed INNER JOIN users ON feed.user_id = users.id ORDER BY feed.date DESC`
  )
  ctx.response.body = JSON.stringify(data.rows)
})

// feed DB에 넣기
router.post('/api/feed', async (ctx) => {
  const { text } = ctx.request.body
  // 미들웨어에 넣기
  const token = ctx.request.header.cookie
  const userId = decodeToken(token)
  if (userId === false) return (ctx.status = 400)
  await pool.query(
    sql`insert into feed(user_id,text) values (${userId},${text})`
  )
  ctx.status = 200
})

router.delete('/api/feed/:id', async (ctx) => {
  const { id } = ctx.params
  const token = ctx.request.header.cookie
  const userId = decodeToken(token)
  if (userId === false) return (ctx.status = 400)
  if (id === undefined) return
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
