const Koa = require('koa')
const app = new Koa()
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

io.on('connection', function(socket){
  console.log('a user connected');

  // 同步任务
  socket.on('task', (msg)=>{
    console.log(msg)
  })
});

// 启动程序，监听端口
server.listen(config.port, () => console.log(`listening on port ${config.port}`))