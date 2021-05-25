//Conexão com o db
async function connect() {

    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection
    }

    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection('mysql://usuario:senha@localhost:porta/nome_do_db')

    console.log('Conectou!')

    global.connection = connection

    return connection
}

//Processamento de transações com o db

async function doTransaction(transaction) {
    const conn = await connect()
    const sql = 'INSERT INTO transaction(value,payment_type,card_number,card_owner,validaty,CVV,description) VALUES (?,?,?,?,?,?,?);'
    const values = [
        transaction.value,
        transaction.payment_type,
        transaction.card_number,
        transaction.card_owner,
        transaction.validaty,
        transaction.CVV,
        transaction.description]

    await conn.query(sql, values)


//Inserir os recebíveis 

    let date = new Date()
    let datePlus30 = new Date()

    datePlus30.setDate(date.getDate() + 30)

    let dateISO = (date.toISOString()).slice(0, 10)
    let dateISOplus30 = (datePlus30.toISOString()).slice(0, 10)

    var transactions_register = await queryTransaction()

    var lastTransaction = transactions_register[transactions_register.length - 1]

    if (lastTransaction.payment_type == 'debit_card') {
        payable = {
            transaction_cod: lastTransaction.cod,
            status: 'paid',
            date: dateISO,
            fee: Number(lastTransaction.value) * 0.97
        }
    } else {
        payable = {
            transaction_cod: lastTransaction.cod,
            status: 'waiting_funds',
            date: dateISOplus30,
            fee: Number(lastTransaction.value) * 0.95
        }
    }

    await insertPayable(payable)

}

//Consulta das transações 
async function queryTransaction() {
    const conn = await connect()
    const sql = 'SELECT * FROM transaction;'
    const [rows] = await conn.query(sql)

    const values = rows.map((el) => {

        return {
            cod: el.cod,
            value: el.value,
            payment_type: el.payment_type,
            card_number: el.card_number,
            card_owner: el.card_owner,
            validaty: el.validaty,
            CVV: el.CVV,
            description: el.description
        }

    })

    return values

}

//Função dos recebíveis que é executado na função transaction 

async function insertPayable(payable) {

    const conn = await connect()
    const sql = 'INSERT INTO payable(transaction_cod,status,payment_date,fee) VALUES (?,?,?,?)'

    const value = [
        payable.transaction_cod,
        payable.status,
        payable.date,
        payable.fee
    ]

    await conn.query(sql, value)
}

async function queryCash(){
    const conn = await connect()
    const sql = 'SELECT * FROM cash;'
    const [rows] = await conn.query(sql)

    return rows
}
module.exports = { doTransaction, queryTransaction,queryCash }
