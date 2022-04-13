import Koa from 'koa'
import cors from 'koa-cors'
import koaBody from 'koa-body'
import router from './routes'
import { catchError } from './utils.ts/check'
const app = new Koa()
/**
 * 每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。那为什么需要调用await next()呢？
原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数，此处我们把每个async函数称为中间件。
 */
// 配置cors中间件允许全局跨域
app.use(cors())

// 解析body文件
app.use(
  koaBody({
    multipart: true, // 解析多个文件
    formidable: {
      maxFieldsSize: 100 * 1024 * 1024 //设置上传文件大小限制
    }
  })
)

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.URL}`)
  await next()
})

app.use(async (ctx, next) => {
  try {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
    console.log(`耗时${ms}ms`)
  } catch (error) {
    catchError(error, ctx)
  }
})

app.use(router.routes())

app.listen(8080, () => {
  console.log(`服务运行于8080端口`)
})
