import KoaRouter from 'koa-router'
import { Context } from 'koa'
import { readFile, writeFile } from '../utils.ts/jsonFileOperation'
import { IStudent } from '../types/check'
import { catchError, check, generateOk } from '../utils.ts/check'

const router = new KoaRouter({ prefix: '/api' })
const FILEPTAH = `../data/check.json`
// 获取check列表
router.get(`/checklist`, (ctx: Context) => {
  try {
    const checklist = readFile<IStudent[]>(FILEPTAH)
    check(!!checklist, 'File_Read_Error')
    ctx.body = generateOk(checklist)
  } catch (error) {
    catchError(error, ctx)
  }
})

export default router
