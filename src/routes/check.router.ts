import KoaRouter from 'koa-router'
import { Context } from 'koa'
import { nanoid } from 'nanoid'
import chineseName from 'chinese-randname'
import { readFile, writeFile } from '../utils.ts/jsonFileOperation'
import { IStudent } from '../types/check'
import { catchError, check, generateOk, isExistId } from '../utils.ts/check'

const router = new KoaRouter({ prefix: '/api/check' })
const FILEPTAH = `../data/check.json`

// 获取check列表
router.get(`/checklist`, (ctx: Context) => {
  try {
    const _checklist = readFile<IStudent[]>(FILEPTAH)
    check(!!_checklist, 'File_Read_Error')
    ctx.body = generateOk(_checklist)
  } catch (error) {
    catchError(error, ctx)
  }
})

// 随机增加一组数据
router.post(`/add`, (ctx: Context) => {
  try {
    const _checklist = readFile<IStudent[]>(FILEPTAH) as IStudent[]
    check(!!_checklist, 'File_Read_Error')
    const newCheckList: IStudent[] = []
    for (let i = 0; i < 10; i++) {
      newCheckList.push({
        id: nanoid(),
        name: chineseName(),
        score: Math.floor(Math.random() * 101)
      })
    }
    const finalCheckList = _checklist.concat(newCheckList)
    check(!!finalCheckList, 'Internel_Server_Error')
    const res = writeFile(finalCheckList, FILEPTAH)
    check(!!res, ' File_Write_Error')
    ctx.body = generateOk({
      total: finalCheckList.length,
      list: finalCheckList
    })
  } catch (error) {
    catchError(error, ctx)
  }
})

// 删除数据
router.post(`/remove`, (ctx: Context) => {
  try {
    const _checklist = readFile(FILEPTAH) as IStudent[]
    const { id: _id } = ctx.request.body as { id: string }
    check(!!_id, 'Id_is_Not_Found')
    check(isExistId(_checklist, _id),'Id_is_Not_Exist')
    check(
      writeFile(
        _checklist.filter(item => item.id !== _id),
        FILEPTAH
      ),
      'File_Write_Error'
    )
    ctx.body = generateOk()
  } catch (error) {
    catchError(error, ctx)
  }
})
export default router
