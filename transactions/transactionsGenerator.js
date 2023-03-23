import { redis } from '../om/client.js'
import { bankTransactionRepository } from '../om/bankTransaction-repository.js'
import source from './transaction_sources.json' assert {type: 'json'}
import { formatDate, createAmount, getRandom } from './utilities.js'

const TRANSACTION_RATE_MS = 10000
const TRANSACTIONS_STREAM = "transactions"
const BALANCE_TS = 'balance_ts';
const SORTED_SET_KEY = 'bigspenders';
let balance = 100000.00;

const streamBankTransaction = async (transaction) => {
  const transactionString = JSON.stringify(transaction)
  const streamResult = await redis.XADD(
    TRANSACTIONS_STREAM,
    '*', {
      'transaction': transactionString
    }
  )
}

const createTransactionAmount = (vendor, random) => {

  let amount = createAmount()
  balance += amount
  balance = parseFloat(balance.toFixed(2))

  redis.ts.add(BALANCE_TS, '*', balance)
  redis.zIncrBy(SORTED_SET_KEY, (amount * -1), vendor)

  return amount
}

export const createBankTransaction = async (userName) => {

  const random = getRandom()
  const vendor = source[random % source.length]
  const amount = createTransactionAmount(vendor.fromAccountName, random)

  const transaction = {
    id: random * random,
    fromAccount: Math.floor((random / 2) * 3),
    fromAccountName: vendor.fromAccountName,
    toAccount: 1580783161, // arbitrary account ID for bob
    toAccountName: userName,
    amount: amount,
    description: vendor.description,
    transactionDate: formatDate(new Date()),
    transactionType: vendor.transactionType,
    balanceAfter: balance
  }

  const bankTransaction = await bankTransactionRepository.save(transaction)
  streamBankTransaction(bankTransaction)
  console.log('Created bankTransaction')
  console.log(bankTransaction)
  return bankTransaction
}

const createInitialStream = (userName) => {
  redis.delete(TRANSACTIONS_STREAM);
  for (let i = 0; i < 10; i++) {
    createBankTransaction(userName)
  }
}

const deleteSortedSet = () => {
  redis.delete(SORTED_SET_KEY);
  console.info(`Deleted ${SORTED_SET_KEY} sorted set`);
}

export const getBalanceTS = async () => {
  const balanceTS = await redis.ts.range(
    BALANCE_TS,
    Date.now() - (1000 * 60 * 60 * 24 * 7),
    Date.now())
    console.log(balanceTS)
    return balanceTS
}