
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

connect()

module.exports = {}