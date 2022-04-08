import { Context } from 'koa'

export function catchError(err: any, ctx: Context) {
  ctx.body = {
    ...err
  }
}
