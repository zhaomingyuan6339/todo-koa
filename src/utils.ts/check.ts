import { Context } from 'koa'
import { ITodoData } from '../types/todo'
import { Exception } from './exception'

class Error {
  public stat: string
  public msg: string
  constructor(stat: string) {
    this.stat = stat
    this.msg = Exception.get(stat)
  }
}

function check(bool: Boolean, stat?: string) {
  if (!bool) {
    throw new Error(stat)
  }
}
function catchError(err: typeof Error, ctx: Context) {
  console.log('path', ctx.path)
  console.log('error', err)
  ctx.body = {
    ...err
  }
}

function generateOk<T>(data?: T) {
  return {
    stat: 'ok',
    data
  }
}

// 检查数组中是否存在该id
function isExistId<U extends { id: string }>(arr: Array<U>, id: string) {
  for (let item of arr) {
    while (item.id === id) {
      return true
    }
  }
  return false
}
export { catchError, check, Error, generateOk, isExistId }
