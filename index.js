async function app() {
    const db = require('./db.js')
    let tran = {
        value:'2000',
        payment_type:'debit_card',
        card_number:'1234123412344321',
        card_owner:'Ana Carolina Brites da Silva',
        validaty:'022022',
        cvv:'123',
        description:'Piano'
    }

    var transactions_register = await db.queryTransaction()

    db.transaction(tran)
}

app()