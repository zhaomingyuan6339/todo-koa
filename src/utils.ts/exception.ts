import Stat from '../config/stat'
const _stat = new Map<string, string>()
class Exception {
  public stat: string
  public msg: string
  constructor(stat: string, msg: string) {
    this.stat = stat
    this.msg = msg
  }

  static updates(stat: { [props: string]: string }) {
    for (let key in stat) {
      _stat.set(key, stat[key])
    }
  }

  static get(key: string):string {
    return _stat.get(key) as string
  }

  static set(key: string, value: string) {
    _stat.set(key, value)
  }
}

Exception.updates(Stat)

export { Exception }
