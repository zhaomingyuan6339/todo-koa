import * as fs from 'fs'
import * as path from 'path'
import { ITodoData } from '../types/todo'
import { Error } from './check'
import { catchError, check } from './check'
// 读取文件
export function readFile<T>(pathName: string): boolean | T {
  try {
    const _url = path.join(__dirname, pathName)
    if (!fs.existsSync(_url)) return false
    const file = JSON.parse(fs.readFileSync(_url, 'utf-8')) as T
    return file
  } catch (error) {
    console.trace(error)
  }
}

// 写入文件
export function writeFile<T>(data: T, pathName: string): boolean {
  try {
    const _path = path.join(__dirname, pathName)
    if (!fs.existsSync(_path)) return false
    fs.writeFileSync(_path, JSON.stringify(data))
    return true
  } catch (error) {
    console.trace(error)
  }
}
