const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('koa-cors');
const login = require('./libs/login');
const plans = require('./libs/plans');
const save = require('./libs/save');
const db = require('./libs/db');
// const koaJwt = require('koa-jwt');
// const { secret } = require('./libs/config.js')
const app = new Koa();
const router = new Router;

db.initDB();
app.use(koaBody());

// app.use(
//     koaJwt({
//         secret,
//     }).unless({ path: [/\/login/] })
// );

app.use(cors());
router.post('/login', login)
router.get('/plans', plans)
router.post('/save',save)

app.use(router.routes());
app.listen(8080);