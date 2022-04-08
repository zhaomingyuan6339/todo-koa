import * as fs from 'fs'
import * as path from 'path'
// 读取文件
export function readFile(pathName: string): string {
  return fs.readFileSync(path.resolve(__dirname, pathName), 'utf-8')
}
// 写入文件

export function writeFile<T>(data: T, pathName: string): void {
  fs.writeFileSync(path.resolve(__dirname, pathName), JSON.stringify(data))
}
