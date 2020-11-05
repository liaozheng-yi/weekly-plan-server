const jwt = require("jsonwebtoken");
const { getDB } = require("./db");
const { secret } = require("./setSecret");


module.exports = async (ctx) => {
    await jwt.verify(ctx.request.header.authentication, secret, async (err, decoded) => {
        if (err) {
            ctx.body = '未携带token或token无效';
            return
        }
        // console.log('save,连接成功');
        const { thisYear,thisWeek, weekdays, wholeWeek } = ctx.request.body;
        const { uid } = decoded
        console.log(uid, ctx.request.body);
        //判断当前是否有该数据，如果有，则更新，如果没有，则添加
        let sql = {
            insert: `INSERT INTO plans (id,uid,thisYear,thisWeek,weekdays,wholeWeek) VALUES (0,?,?,?,?,?)`,
            update: `UPDATE plans SET weekdays=?, wholeWeek=? WHERE uid=? AND thisYear=? AND thisWeek=?`
        }

        let [update] = await getDB().execute(sql.update, [weekdays, wholeWeek, uid, thisYear,thisWeek]);
        console.log('update',update.affectedRows);
        
        if (update.affectedRows > 0) {
            ctx.body = {
                state: 1,
                msg: '保存成功'
            }
        } else {
            let [insert] = await getDB().execute(sql.insert,[uid,thisYear,thisWeek,weekdays,wholeWeek])
            console.log('insert',insert.affectedRows);
            if(insert.affectedRows>0){
                ctx.body={
                    state: 1,
                    msg: '创建成功'
                }
            }else{
                ctx.body = {
                    state: 0,
                    msg: '保存失败'
                }
            }
        }
    })
}