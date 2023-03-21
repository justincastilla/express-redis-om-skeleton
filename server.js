import 'dotenv/config'

import express from 'express'
import session from 'express-session'
import { RedisStackStore } from 'connect-redis-stack'

import { config } from './config.js'
import { redis } from './om/client.js'
import { accountRouter } from './routers/account-router.js'

/* configure your session store */
const store = new RedisStackStore({
  client: redis,
  prefix: 'appname:',
  ttlInSeconds: 3600
})

/* create an express app, use JSON, use the session store */
const app = new express()
app.use(express.json())
app.use(session({
  store: store,
  resave: false,
  saveUninitialized: false,
  secret: '5UP3r 53Cr37'
}))

/* bring in some routers */
app.use('/account', accountRouter)

/* start the server */
app.listen(config.expressPort, () => console.log("Listening on port", config.expressPort))
