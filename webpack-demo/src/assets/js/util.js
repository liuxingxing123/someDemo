export const storageB2Str = function (value) {
  /**
   * 输入单位为b的整数，输出保留2位小数，自适应单位，ex. 1.89MiB, 978GiB
   */

  let tmp
  let size = parseInt(value, 10)
  let units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
  for (let i = 0; i < units.length; i++) {
    let unit = units[i]
    tmp = size / 1024
    if (tmp < 1) {
      let f = parseFloat(size)
      return (f.toString().includes('.') ? f.toFixed(2) : f) + unit
    }
    size = tmp
  }
  return parseFloat(size).toFixed(2)
};

export const storageStr2B = function (s) {
  /**
   * 输入整数带单位字符串，输出浮点数单位B，可接受输入示例：827378mib, 177gb, 1000, 1Pib
   */
  let str = s
  let num = parseInt(str, 10)
  let unit = str.replace(' ', '').replace(num.toString(), '').toLowerCase().replace('b', '')
  let c = 1000
  if (unit.includes('i')) {
    c = 1024
    unit = unit.replace('i', '')
  }
  let times = ['', 'k', 'm', 'g', 't', 'p'].indexOf(unit)
  while (times > 0) {
    num *= c
    times--
  }
  return num
};

export const initOrgDS = function (data,num) {
  /**
   * 组织结构专用，展平+初始化一些数据
   */
  function f(d, level) {
    let out = []
    d.forEach((item) => {
      if (item) {
        item.level = level
        item.hidden = level != 1
        item.folded = level == 1
        if(num=='1'){
          if (item.children && item.children.length > 0) {
            out = out.concat([item])
            out = out.concat(f(item.children, level + 1))
          } else {
            item.noChildren = true
            out = out.concat([item])
          }
        }
        if(num=='2'){
          if (item.orgList && item.orgList.length > 0) {
            out = out.concat([item])
            out = out.concat(f(item.orgList, level + 1))
          } else {
            item.noChildren = true
            out = out.concat([item])
          }
        }
      }
    })
    return out
  }

  let result = f(data, 1)
  result.forEach((item, index) => {
    if(num=='1'){
      delete item.children
    }
    if(num=='2'){
      delete item.orgList
    }
    item.originalIndex = index
  })
  return result
}

/**
 * 保留有效小数
 * @param value 目标数据
 * @param len   有效小数长度 默认长度是两位
 */
export const keepValidDecimals = function (value, len = 2) {
  let str = value
  let index = value.indexOf('.')
  let index2 = value.indexOf('(') - 1  // 首个字母出现的位置
  if (index !== -1 && (index2 - index > len + 1)) {
    str = value.substring(0, index + 3) + value.substring(index2)
  }
  return str
}

export const arrayToString = (row) => {
  return row.partitionEnvNames.join(';');
}
