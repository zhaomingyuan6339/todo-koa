import { Context } from 'koa'
import Router from 'koa-router'
import { ITodoData } from '../types/todo'
import { catchError, check, generateOk, isExistId } from '../utils.ts/check'
import { readFile, writeFile } from '../utils.ts/jsonFileOperation'

const __FILEPATH = '../data/todo.json'
const router = new Router({ prefix: '/api' })

// 获取列表
router.get(`/todolist`, async (ctx: Context) => {
  try {
    const todolist = readFile<ITodoData[]>(__FILEPATH) 
    check(!!todolist, 'File_Read_Error')
    ctx.body = generateOk(todolist)
  } catch (error) {
    catchError(error, ctx)
  }
})
// 增加项
router.post(`/add`, async (ctx: Context) => {
  try {
    const todo = ctx.request.body as ITodoData
    const { id, content, completed } = todo
    check(!!id, 'Id_is_Not_Found')
    check(!!content, 'Todo_Item_Not_Found')
    check(completed !== undefined || null, 'Completed_Not_Found')
    let todolist = readFile<ITodoData[]>(__FILEPATH) as ITodoData[]
    check(!!todolist, 'File_Read_Error')
    const iExist = todolist.find(item => item.content === todo.content)
    check(!iExist, 'Todo_Item_is_Exist')
    todolist.push(todo)
    const isWrite = writeFile<ITodoData[]>(todolist, __FILEPATH)
    check(isWrite, 'File_Write_Error')
    ctx.body = generateOk()
  } catch (error) {
    catchError(error, ctx)
  }
})
// 删除项
router.post(`/remove`, async (ctx: Context) => {
  try {
    const todolist = readFile(__FILEPATH) as ITodoData[]
    check(!!todolist, 'File_Read_Error')
    const { id } = ctx.request.body as {
      id: string
    }
    check(!!id, 'Id_is_Not_Found')
    check(isExistId(todolist, id), 'Id_is_Not_Exist')
    const newTodo = todolist.filter(item => item.id !== id)
    const isWrite = writeFile<ITodoData[]>(newTodo, __FILEPATH)
    check(isWrite, 'File_Write_Error')
    ctx.body = generateOk()
  } catch (error) {
    catchError(error, ctx)
  }
})
// toggle
router.post(`/toggle`, async (ctx: Context) => {
  try {
    let todolist = readFile(__FILEPATH) as ITodoData[]
    check(!!todolist, 'File_Read_Error')
    const { id } = ctx.request.body as {
      id: string
    }
    check(!!id, 'Id_is_Not_Found')
    check(isExistId(todolist, id), 'Id_is_Not_Exist')
    const isWrite = writeFile(
      todolist.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed
          console.log(todo.completed)
        }
        return todo
      }),
      __FILEPATH
    )
    console.log(todolist)
    check(isWrite, 'File_Write_Error')
    ctx.body = generateOk()
  } catch (error) {
    catchError(error, ctx)
  }
})

export default router
