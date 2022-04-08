import Koa from 'koa'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import { Context } from 'koa'
import cors from 'koa-cors'
import { readFile, writeFile } from './utils.ts/jsonFileOperation'
import { catchError } from './utils.ts/catchError'
import { ITodoData } from './types/todo'
const app = new Koa()
const router = new koaRouter()
/**
 * 每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。那为什么需要调用await next()呢？
原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数，此处我们把每个async函数称为中间件。
 */

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
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  console.log(ms)
})

const PREFIX = `/api`
// 获取列表
router.get(`${PREFIX}/todolist`, async (ctx: Context) => {
  try {
    const todolist = readFile('../todo.json')
    ctx.body = todolist
  } catch (error) {
    catchError(error, ctx)
  }
})
// 增加项
router.post(`${PREFIX}/add`, async (ctx: Context) => {
  try {
    const todo = ctx.request.body as ITodoData
    let todolist = JSON.parse(readFile('../todo.json')) as ITodoData[]
    const iExist = todolist.find(item => item.content === todo.content)
    if (!iExist) {
      todolist.push(todo)
      writeFile<ITodoData[]>(todolist, '../todo.json')
      ctx.body = {
        stat: 200,
        msg: 'ok'
      }
      return
    }
    ctx.body = {
      stat: 100,
      msg: '该事项已经添加过了！'
    }
    return
  } catch (error) {
    catchError(error, ctx)
  }
})
// 删除项
router.post(`${PREFIX}/remove`, async (ctx: Context) => {
  try {
    const todolist = JSON.parse(readFile('../todo.json')) as ITodoData[]
    const { id } = ctx.request.body as {
      id: string
    }
    const newTodo = todolist.filter(item => item.id !== id)
    writeFile<ITodoData[]>(newTodo, '../todo.json')
    ctx.body = {
      stat: 200,
      msg: ' ok'
    }
  } catch (error) {
    catchError(error, ctx)
  }
})
// toggle
router.post(`${PREFIX}/toggle`, async (ctx: Context) => {
  try {
    let todolist = JSON.parse(readFile('../todo.json')) as ITodoData[]
    const { id } = ctx.request.body as {
      id: string
    }
    writeFile(
      todolist.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed
        }
        return todo
      }),
      '../todo.json'
    )
    ctx.body = {
      stat: 200,
      msg: 'ok'
    }
  } catch (error) {
    catchError(error, ctx)
  }
})
app.use(router.routes())
app.listen(8080, () => {
  console.log(`服务运行于8080端口`)
})
