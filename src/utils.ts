import * as url from 'url'
import * as Q from 'q'
import * as fs from 'fs'

// 下载文件
export const download = (uri: string, filename: string) => {
  const protocol = url.parse(uri).protocol!.slice(0, -1)
  const deferred = Q.defer()
  const onError = function (e: any) {
    fs.unlink(filename, () => {})
    deferred.reject(e)
  }
  require(protocol)
    .get(uri, function (response: any) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        let downLength = 0
        const contentLength = parseInt(response.headers['content-length'])
        const fileStream = fs.createWriteStream(filename)
        fileStream.on('error', onError)
        response.on('data', (chunk: any) => {
          downLength += chunk.length
          const progress = Math.floor((downLength * 100) / contentLength)
          const str = '下载：' + progress + '%'
          console.log(str) // 打印进度
          fileStream.write(chunk, () => {}) // 写文件
        })
        response.on('end', () => {
          fileStream.on('close', () => {
            console.log('Download Completed!')
            deferred.resolve
          })
        })
      } else if (response.headers.location) {
        // 重定向
        deferred.resolve(download(response.headers.location, filename))
      } else {
        deferred.reject(new Error(response.statusCode + ' ' + response.statusMessage))
      }
    })
    .on('error', onError)
  return deferred.promise
}

// 普通 GET 请求，返回响应体
export const xhrGet = (uri: string) => {
  const protocol = url.parse(uri).protocol!.slice(0, -1)
  return new Promise((resolve) => {
    require(protocol).get(uri, function (res: any) {
      let dataString = ''
      res.on('data', function (data: any) {
        dataString += data
      })
      res.on('end', function () {
        resolve(dataString)
      })
    })
  })
}

// 获取昨天的日期 YYYY-MM-DD
export const getYesterday = () => {
  let nowDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
  let year = nowDate.getFullYear()
  let month: any = nowDate.getMonth() + 1
  let day: any = nowDate.getDate()
  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day
  return year + '-' + month + '-' + day
}
