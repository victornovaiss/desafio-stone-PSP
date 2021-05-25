const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db')


app.listen(3000, () => {
    console.log('Servidor ativo!!!')
})

app.use(cors())
app.use(express.json())

app.get('/transactions', async (req, res) => {
    var transactions = await db.queryTransaction()
    res.send(transactions)
})

app.get('/transactions/:cod', async (req, res) => {
    var { cod } = req.params
    var transactions = await db.queryTransaction()

    transactions.forEach(element => {
        if (element.cod == cod)
            res.send(element);
    });

})

app.post('/transactions/post', async (req, res) => { 
    
    var body = req.body

    await db.doTransaction(body)

    res.status(201).send('ok')
})

app.get('/cash', async (req, res) => { 
    var cash = await db.queryCash()
    res.send(cash)
})

app.put('/transactions', (req, res) => { })