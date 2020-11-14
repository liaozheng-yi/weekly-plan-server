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
        const sql = `SELECT * FROM plans WHERE uid=? AND year=? AND week=?`
        const [row] = await getDB().execute(sql, [uid, year, week])
        // console.log(row[0]?true:false);
        if (row[0]) {
            const { year, week, weekdays, wholeWeek } = row[0];
            ctx.body = {
                state: 1,
                msg: '请求数据成功',
                data: {
                    year: year,
                    week: week,
                    weekdays: JSON.parse(weekdays),
                    wholeWeek: JSON.parse(wholeWeek),
                }
            }    
        } else {
            ctx.body = {
                state: 0,
                msg: '请求数据失败，该周没有plan数据',
                data: {
                    year:year,
                    week:week,
                    weekdays:[],
                    wholeWeek:[]
                }
            }
        }
    });
}