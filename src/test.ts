import { download, xhrGet, getYesterday } from './utils'
import { URL_TO_GET_TOKEN } from './constants'
import * as path from 'path'

async function downloadCsvFile() {
  const token = await xhrGet(URL_TO_GET_TOKEN)
  const url = `https://data-nexus.idata.shopeemobile.com/api/v1/dn-s3/requestUrls?token=${token}&requestDateTime=${getYesterday()}T06%3A00%3A00%2B08%3A00`
  const pathArr = (await xhrGet(url)) as string
  const getFielUrl = JSON.parse(pathArr)[0].replace('"', '')
  const fileName = path.resolve(process.cwd(), './') + `/workspace/me-click-page-data-${getYesterday()}.zip`
  download(getFielUrl, fileName)
}

export default downloadCsvFile
