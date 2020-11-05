const jwt = require('jsonwebtoken');
const {secret} = require('./setSecret');
const {getDB} = require('./db');

module.exports = async (ctx) => {
    console.log('login接收了前端请求', ctx.request.body);
    const { user, pwd } = ctx.request.body;
    const sql = `SELECT * FROM users WHERE username=? AND password=?`;
    const [row] = await getDB().execute(sql,[user,pwd]);
    const userInfo = row[0];

    if (userInfo) {
        const token = jwt.sign({ uid: userInfo.id }, secret, {
            expiresIn: '2h'
        })
        ctx.body = {
            state: 1,
            msg: '登录成功',
            data: {
                token,
            }
        }
    }else{
        ctx.body={
            state:0,
            mag:'登录失败',
            data:{}
        }
    }
}

