// import cron from 'node-cron'
import express from 'express'
const app = express()

import downloadCsvFile from './test'

downloadCsvFile()

/* 
cron.schedule("* * * * *", function() {
  console.log("running a task every minute");
}); */

app.listen(3128, () => console.log('timed-jobs app listening on port 3128!'))
