//Conexão com o db
async function connect() {

    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection
    }

    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection('mysql://usuario:senha@localhost:porta-de-hopedagem/nome-da-tabela')

    console.log('Conectou!')

    global.connection = connection

    return connection
}

//Processamento de transações com o db

async function transaction(transaction) {
    const conn = await connect()
    const sql = 'INSERT INTO transaction(value,payment_type,card_number,card_owner,validaty,CVV,description) VALUES (?,?,?,?,?,?,?);'
    const values = [
        transaction.value,
        transaction.payment_type,
        transaction.card_number,
        transaction.card_owner,
        transaction.validaty,
        transaction.cvv,
        transaction.description]

    await conn.query(sql, values)



}

//Consulta das transações 
async function queryTransaction() {
    const conn = await connect()
    const sql = 'SELECT * FROM transaction;'
    const [rows] = await conn.query(sql)

    return rows

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
    
    await conn.query(sql,value)
}

//Atualizar a conta
async function updateCash(){
    const conn = await connect()
    
    let transactions = await queryTransaction()

    let availableToPayment = 0
    let waitingFunds = 0

    transactions.forEach(element => {
        if (element.status == 'paid'){
            availableToPayment += element.fee 
        }else{
            waitingFunds += element.fee
        }
    })

    const sql = 'UPDATE provider.cash SET paid = ?, waiting_funds = ? WHERE (account_id = 1);' 

    await conn.query(sql,[availableToPayment,waitingFunds])
}

module.exports = { transaction, queryTransaction, insertPayable, updateCash}