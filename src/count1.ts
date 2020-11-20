const parse = require("csv-parse");
const fs = require("fs");

const DATE = "9-23";
const GAP_TIME = 30000;

// const ME_PAGE_FILE = `./${DATE}-mepage-activated-user.csv`;
// const SPL_HOME_FILE = `./${DATE}-spl-home.csv`;

const ME_PAGE_FILE = `./10-25-mepage-all-user.csv`;
const SPL_HOME_FILE = `./10-25-jsinit-mponly.csv`;

/* 取csv数据 */
const mepagePromise = new Promise((resolve, reject) => {
  fs.readFile(ME_PAGE_FILE, function (err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data.toString());
    }
  });
});

const splPromise = new Promise((resolve, reject) => {
  fs.readFile(SPL_HOME_FILE, function (err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data.toString());
    }
  });
});

const convert2Obj = (buf) => {
  const obj = {};
  const arr = buf.split("\n");
  arr.forEach((double) => {
    const a = double.split(",");
    obj[a[0] * 1] = obj[a[0] * 1] ? obj[a[0] * 1] + "," + a[1] : a[1];
  });
  return { obj, rowLen: arr.length, usrLen: Object.keys(obj).length };
};

Promise.all([mepagePromise, splPromise]).then(([mepageBuf, splBuf]) => {
  console.log(ME_PAGE_FILE);
  console.log(SPL_HOME_FILE);
  console.log(`gap time ${GAP_TIME} ms`);
  const { obj: meobj, rowLen: meRowLen, usrLen: meUsrLen } = convert2Obj(mepageBuf);
  const { obj: splobj, rowLen: splRowLen, usrLen: splUsrLen } = convert2Obj(splBuf);
  console.log("Me page", meRowLen);
  console.log("Spl page", splRowLen);
  console.log("Me page(distinct user)", meUsrLen);
  console.log("Spl page(distinct user)", splUsrLen);
  let PVTotal = 0;
  let UVTotal = 0;
  Object.keys(meobj).forEach((usrid) => {
    if (!splobj[usrid]) return;
    const spl = splobj[usrid] || "";
    const me = meobj[usrid] || "";
    if (spl.length === 13 && me.length === 13) {
      if (spl - me < GAP_TIME && spl - me >= 0) {
        PVTotal++;
        UVTotal++;
      }
      return;
    }
    const s = spl.split(",");
    const m = me.split(",");
    let temptotal = 0;
    s.forEach((stime) => {
      m.forEach((mtime, idx) => {
        if (stime - mtime < GAP_TIME && stime - mtime >= 0) {
          temptotal++;
          m[idx] = 0;
        }
      });
    });
    PVTotal += temptotal;
    UVTotal += temptotal ? 1 : 0;
  });
  console.log("PV time match count", PVTotal);
  console.log("UV time match count", UVTotal);
  console.log("PV time match count / Me page", PVTotal / meRowLen);
  console.log("UV time match count/ Me page(distinct user)", UVTotal / meUsrLen);
});
