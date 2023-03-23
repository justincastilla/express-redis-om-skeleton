import 'dotenv/config'
import * as cron from 'node-cron'

import express from 'express'
import session from 'express-session'
import { RedisStackStore } from 'connect-redis-stack'

import { createBankTransaction } from './transactions/transactionsGenerator.js'
import { config } from './config.js'
import { redis } from './om/client.js'
import { accountRouter } from './routers/account-router.js'
import { transactionRouter } from './routers/transaction-router.js'

/* configure your session store */
const store = new RedisStackStore({
  client: redis,
  prefix: 'redisBank:',
  ttlInSeconds: 3600
})

cron.schedule('*/10 * * * * *', () => {
  const userName = process.env.REDIS_USERNAME
  createBankTransaction(userName)
});

/* create an express app, use JSON, use the session store */
const app = new express()

app.use(express.json())
app.use(session({
  store: store,
  resave: false,
  saveUninitialized: false,
  secret: '5UP3r 53Cr37'
}))

app.get('/hello', (req, res) => {
  res.send({'message': 'world!'})
})
/* bring in some routers */
app.use('/account', accountRouter)
app.use('/transaction', transactionRouter)

/* start the server */
app.listen(config.expressPort, () => console.log("Listening on port", config.expressPort))
