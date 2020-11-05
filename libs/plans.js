const jwt = require("jsonwebtoken");
const { secret } = require("./setSecret");
const { getDB } = require('./db');
const qs = require('qs');

module.exports = async (ctx) => {
    // console.log(ctx.request.header.authentication);
    await jwt.verify(ctx.request.header.authentication, secret, async function (err, decoded) {
        if (err) {
            ctx.body = '未携带token或token无效';
            return
        }
        // console.log('plans接收了前端请求', decoded);
        let query = ctx.request.url.slice(7)
        let uid = decoded.uid
        let { year, week } = qs.parse(query)
        //根据decoded里面的uid、前端提供的周数，去数据库查询数据，然后返回给前端
        const sql = `SELECT * FROM plans WHERE uid=? AND thisYear=? AND thisWeek=?`
        const [row] = await getDB().execute(sql, [uid, year, week])
        // console.log(row[0]?true:false);
        if (row[0]) {
            const { thisYear, thisWeek, weekdays, wholeWeek } = row[0];
            ctx.body = {
                state: 1,
                msg: '请求数据成功',
                data: {
                    thisYear: thisYear,
                    thisWeek: thisWeek,
                    weekdays: JSON.parse(weekdays),
                    wholeWeek: JSON.parse(wholeWeek),
                }
                // data: {
                //     thisYear:2020,
                //     thisWeek: 41,
                //     weekdays: [
                //         {
                //             date: "10-5",
                //             am: [
                //                 {
                //                     work: 'xibeizi',
                //                     done: true
                //                 }, {
                //                     work: 'xibeizi',
                //                     done: false
                //                 }
                //             ],
                //             pm: [
                //                 {
                //                     work: 'xibeizi',
                //                     done: false
                //                 }, {
                //                     work: 'xibeizi',
                //                     done: true
                //                 }
                //             ]
                //         }, {
                //             date: "10-6",
                //             am: [
                //                 {
                //                     work: 'xibeizi',
                //                     done: false
                //                 }, {
                //                     work: 'xibeizi',
                //                     done: true
                //                 }
                //             ],
                //             pm: [
                //                 {
                //                     work: 'xibeizi',
                //                     done: false
                //                 }, {
                //                     work: 'xibeizi',
                //                     done: true
                //                 }
                //             ]
                //         }
                //     ],
                //     wholeWeek:[
                //         {
                //             work: 'zhaopin',
                //             done: false,
                //             detail: [
                //                 {
                //                     work: 'xiaqi',
                //                     done: true,
                //                     detail: [
                //                         {
                //                             work: 'shuijiao',
                //                             done: true,
                //                         },
                //                         {
                //                             work: 'shuijiao',
                //                             done: true,
                //                         }
                //                     ]
                //                 }, {
                //                     work: 'shuijiao',
                //                     done: false,
                //                 }
                //             ]
                //         }, {
                //             work: 'quanwai',
                //             done: true,
                //         }
                //     ]
                // }
                
            }    
        } else {
            ctx.body = {
                state: 0,
                msg: '请求数据失败，该周没有plan数据',
                data: {
                    thisYear:year,
                    thisWeek:week,
                    weekdays:[],
                    wholeWeek:[]
                }
            }
        }
    });
}