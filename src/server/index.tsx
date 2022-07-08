import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'hello'
})

app.use(serve('./build'))
app.use(router.routes())
app.listen(4000)
