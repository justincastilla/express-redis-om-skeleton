import { Router } from 'express'
import '../om/bankTransaction-repository.js'
import { getBalanceTS } from '../transactions/transactionsGenerator.js'
export const transactionRouter = Router()

// transactionRouter.put('/:accountNumber', async (req, res) => {
//   const accountNumber = req.params.accountNumber
//   const accountData = req.body
//   const account = await accountRepository.save(accountNumber, accountData)
//   res.send(account)
// })

// transactionRouter.get('/:accountNumber', async (req, res) => {
//   console.log(req.params)
//   req.session.lastAccessed = new Date()

//   const accountNumber = req.params.accountNumber
//   const account = await accountRepository.fetch(accountNumber)
//   res.send(account)
// })


/*
1. get range of balance:
  from: one week ago
  to: now
  return array of arrays [[timestamp, value]]
*/
transactionRouter.get('/:balance', async (req, res) => {
  const balance = await getBalanceTS()
  let balancePayload = []
  for(let i = 0; i < balance.length; i++) {
    let tempBalance = {
      'x': balance[i].timestamp,
      'y': parseFloat(balance[i].value.toFixed(2))
    }
    balancePayload.push(tempBalance)
  }
  res.send({"balance" : balancePayload})
})