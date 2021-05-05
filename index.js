async function app() {
    const db = require('./db.js')

    let date = new Date()
    let datePlus30 = new Date()
    
    datePlus30.setDate(date.getDate()+30)
    
    let dateISO = (date.toISOString()).slice(0, 10)
    let dateISOplus30 = (datePlus30.toISOString()).slice(0, 10)
    let card_number = '4321432143210009'
    
    let tran = {
        value: '230',
        payment_type: 'credit_card',
        card_number:`******${card_number.slice(6,10)}*****`,
        card_owner: 'Vicente Brites Novais',
        validaty: '1220',
        cvv: '436',
        description: 'Bolachinha'
    }
    
    await db.transaction(tran)
    
    var transactions_register = await db.queryTransaction()
    
    var lastTransaction = transactions_register[transactions_register.length - 1]
    
    let payable = {}

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
            status:'waiting_funds',
            date: dateISOplus30,
            fee: Number(lastTransaction.value) * 0.95
        }
    }

    await db.insertPayable(payable)
    

    console.log(transactions_register)
}

app()