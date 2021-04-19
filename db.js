//Conexão com o db
async function connect() {

    if(global.connection && global.connection.state !== 'disconnected'){
        return global.connection
    }

    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection('mysql://root:pipoca123@localhost:3306/provider')
   
    console.log('Conectou!')

    global.connection = connection

    return connection
}

//Processamento de transações com o db

async function transaction(transaction){
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
    
    await conn.query(sql,values)
}

//Consulta das transações 
async function queryTransaction(){
    const conn = await connect()
    const sql = 'SELECT * FROM transaction;'
    const [rows] = await conn.query(sql)

    return rows

}

module.exports = {transaction,queryTransaction}