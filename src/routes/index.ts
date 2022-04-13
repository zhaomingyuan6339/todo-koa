import Router from 'koa-router'
import todoRouter from './todo.router'
import checkRouter from './check.router'
const router = new Router()
router.use(todoRouter.routes())
router.use(checkRouter.routes())

export default router